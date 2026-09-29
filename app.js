const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter"
];

const FALLBACK_PLACES = [
  {
    name:"Ricklinger Kiesteiche – Sieben-Meter-Teich",
    lat:52.3369, lon:9.7450,
    label:"FKK-Bereich ausgewiesen",
    status:"Bitte aktuelle Baderegeln bzw. Sperrungen beachten.",
    source:"Region Hannover"
  },
  {
    name:"Inselsee – FKK-Strand",
    lat:53.30388, lon:10.48878,
    label:"FKK-Strand",
    status:"Offiziell ausgewiesener FKK-Bereich.",
    source:"Gemeinde Scharnebeck"
  },
  {
    name:"Kennel-Bad",
    lat:52.24216, lon:10.52115,
    label:"Abgetrennter FKK-Bereich",
    status:"Bitte aktuelle Öffnungs- und Saisonhinweise beachten.",
    source:"Kennel-Bad"
  }
];

let map;
let userMarker = null;
let resultMarkers = [];
let userLocation = null;
let searchTimer = null;

const radiusEl = document.getElementById("radius");
const radiusValueEl = document.getElementById("radiusValue");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");
const locateBtn = document.getElementById("locateBtn");

radiusEl.addEventListener("input", () => {
  radiusValueEl.textContent = radiusEl.value;
  if (userLocation) {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => searchPlaces(), 500);
  }
});

function initMap(){
  if (typeof L === "undefined") {
    document.getElementById("map").innerHTML =
      '<div style="padding:20px;font-size:15px">⚠️ Die Kartenbibliothek konnte nicht geladen werden. Bitte die Seite einmal neu laden.</div>';
    return;
  }
  map = L.map("map").setView([52.62,10.08], 9);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom:19,
    attribution:"© OpenStreetMap-Mitwirkende"
  }).addTo(map);
}

function haversineKm(aLat,aLon,bLat,bLon){
  const R=6371;
  const dLat=(bLat-aLat)*Math.PI/180;
  const dLon=(bLon-aLon)*Math.PI/180;
  const x=Math.sin(dLat/2)**2+
    Math.cos(aLat*Math.PI/180)*Math.cos(bLat*Math.PI/180)*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(x));
}

function centerOf(el){
  if (typeof el.lat==="number" && typeof el.lon==="number") return [el.lat,el.lon];
  if (el.center && typeof el.center.lat==="number") return [el.center.lat,el.center.lon];
  return null;
}

function escapeHtml(s){
  return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
}

function clearMarkers(){
  resultMarkers.forEach(m=>map.removeLayer(m));
  resultMarkers=[];
}

function renderResults(items, liveCount, failedParts, radius){
  clearMarkers();
  resultsEl.innerHTML="";

  if (!items.length){
    resultsEl.innerHTML='<div class="card"><div class="muted">Keine passenden FKK-Orte im gewählten Radius gefunden.</div><div class="source">Tipp: Größeren Suchradius wählen oder später erneut suchen.</div></div>';
    return;
  }

  items.sort((a,b)=>a.distance-b.distance);

  items.forEach((p)=>{
    const marker=L.marker([p.lat,p.lon]).addTo(map);
    marker.bindPopup(`<strong>${escapeHtml(p.name)}</strong><br>${escapeHtml(p.label||"FKK-Hinweis")}<br>${p.distance.toFixed(1)} km`);
    resultMarkers.push(marker);

    const card=document.createElement("div");
    card.className="card";
    card.innerHTML=`
      <h3>${escapeHtml(p.name)}</h3>
      <div class="meta">📍 ${p.distance.toFixed(1)} km entfernt<br>
      ${escapeHtml(p.label||"FKK-Hinweis")}${p.type?` · ${escapeHtml(p.type)}`:""}
      ${p.access?`<br>🚪 Zugang: ${escapeHtml(p.access)}`:""}
      ${p.fee?`<br>💶 Eintritt: ${escapeHtml(p.fee)}`:""}
      ${p.opening_hours?`<br>🕒 ${escapeHtml(p.opening_hours)}`:""}
      ${p.status?`<br>ℹ️ ${escapeHtml(p.status)}`:""}</div>
      <div class="source">${p.live ? "Quelle: OpenStreetMap / Overpass" : "Zusatzdaten: bekannte FKK-Orte"}</div>`;
    card.addEventListener("click",()=>map.setView([p.lat,p.lon],14));
    resultsEl.appendChild(card);
  });

  const displayedLiveCount = items.filter(p=>p.live).length;
  if(displayedLiveCount>0){
    statusEl.innerHTML=`✅ Live-OpenStreetMap: ${displayedLiveCount} FKK-Ort(e) angezeigt.`
      + (failedParts?` <span class="muted">(${failedParts} Teilabfrage(n) waren nicht erreichbar.)</span>`:"");
  } else if(liveCount>0){
    statusEl.innerHTML=`ℹ️ OpenStreetMap hat Daten geliefert, aber keine passenden FKK-Orte im Radius.`
      + (failedParts?` <span class="muted">(${failedParts} Teilabfrage(n) waren nicht erreichbar.)</span>`:"");
  } else {
    statusEl.textContent="⚠️ Live-OpenStreetMap ist gerade nicht erreichbar. Bekannte FKK-Orte werden angezeigt.";
  }
}

function buildBboxes(lat,lon,radiusKm){
  // For normal searches use one compact circular query.
  // Only large searches are split into 4 boxes.
  if(radiusKm <= 40) return null;

  const latDelta=radiusKm/111.32;
  const lonDelta=radiusKm/(111.32*Math.max(0.2,Math.cos(lat*Math.PI/180)));
  const midLat=lat, midLon=lon;
  return [
    [lat-latDelta, lon-lonDelta, midLat, midLon],
    [lat-latDelta, midLon, midLat, lon+lonDelta],
    [midLat, lon-lonDelta, lat+latDelta, midLon],
    [midLat, midLon, lat+latDelta, lon+lonDelta]
  ];
}

function queryForBbox(b){
  const [s,w,n,e]=b;
  return `[out:json][timeout:12];(
    nwr(${s},${w},${n},${e})["nudism"~"yes|designated|obligatory|customary|permissive",i];
    nwr(${s},${w},${n},${e})["name"~"FKK|Freikörper|Nacktbad|Nacktbade|Nacktbadestrand|Nudist|Naturist",i];
    nwr(${s},${w},${n},${e})["official_name"~"FKK|Freikörper|Nacktbad|Nacktbade|Nudist|Naturist",i];
    nwr(${s},${w},${n},${e})["description"~"FKK|Freikörper|Nacktbad|Nacktbade|Nudist|Naturist",i];
  );out center tags;`;
}
function queryForRadius(lat,lon,radiusKm){
  return `[out:json][timeout:12];(
    nwr(around:${radiusKm*1000},${lat},${lon})["nudism"~"yes|designated|obligatory|customary|permissive",i];
    nwr(around:${radiusKm*1000},${lat},${lon})["name"~"FKK|Freikörper|Nacktbad|Nacktbade|Nacktbadestrand|Nudist|Naturist",i];
    nwr(around:${radiusKm*1000},${lat},${lon})["official_name"~"FKK|Freikörper|Nacktbad|Nacktbade|Nudist|Naturist",i];
    nwr(around:${radiusKm*1000},${lat},${lon})["description"~"FKK|Freikörper|Nacktbad|Nacktbade|Nudist|Naturist",i];
  );out center tags;`;
}
async function fetchOverpass(query, maxMs=12000){
  let lastError=null;
  for(const endpoint of OVERPASS_ENDPOINTS){
    try{
      const controller=new AbortController();
      const timeout=setTimeout(()=>controller.abort(),maxMs);
      const response=await fetch(endpoint,{
        method:"POST",
        headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
        body:"data="+encodeURIComponent(query),
        signal:controller.signal,
        cache:"no-store"
      });
      clearTimeout(timeout);
      if(!response.ok) throw new Error("HTTP "+response.status);
      const text=await response.text();
      if(!text || text.trim().startsWith("<")) throw new Error("Keine JSON-Antwort");
      return JSON.parse(text);
    }catch(e){
      lastError=e;
    }
  }
  throw lastError || new Error("Overpass nicht erreichbar");
}

function elementsToItems(elements,lat,lon,radiusKm){
  const byId=new Map();

  (elements||[]).forEach(el=>{
    const c=centerOf(el);
    if(!c) return;

    const d=haversineKm(lat,lon,c[0],c[1]);
    if(d>radiusKm) return;

    const tags=el.tags||{};
    const nudism=(tags.nudism||"").toLowerCase();
    const text=[
      tags.name||"",
      tags.official_name||"",
      tags.alt_name||"",
      tags.description||"",
      tags.note||""
    ].join(" ").toLowerCase();

    const hasPositiveNudism=["yes","designated","obligatory","customary","permissive"].includes(nudism);
    const hasFkkText=/fkk|freikörper|nacktbad|nacktbade|nacktbadestrand|nudist|naturist/.test(text);

    // Keep explicit nudism=no out unless the object itself contains a
    // strong FKK term (useful for imperfect OSM tagging).
    if(nudism==="no" && !hasFkkText) return;
    if(!hasPositiveNudism && !hasFkkText) return;

    let label="FKK-/Nacktbereich";
    if(nudism==="designated") label="Ausgewiesener FKK-Bereich";
    else if(nudism==="obligatory") label="Nacktbaden vorgeschrieben";
    else if(nudism==="customary") label="Nacktbaden üblich";
    else if(nudism==="permissive") label="FKK erlaubt";
    else if(nudism==="yes") label="FKK / Nacktbaden";
    else if(hasFkkText) label="FKK-Hinweis in OpenStreetMap";

    const type =
      tags.leisure==="bathing_place" ? "Badeplatz" :
      tags.leisure==="beach_resort" ? "Strandbad" :
      tags.leisure==="swimming_area" ? "Schwimmbereich" :
      tags.leisure==="beach" || tags.natural==="beach" ? "Strand" :
      tags.amenity==="public_bath" ? "Bad" : "";

    const name=tags.name||tags.official_name||tags.alt_name||"FKK-/Nacktbereich";
    const key=`${el.type}/${el.id}`;

    if(!byId.has(key)){
      byId.set(key,{
        name,
        lat:c[0],
        lon:c[1],
        label,
        status:tags.description||tags.note||"",
        distance:d,
        live:true,
        type,
        nudism,
        fee:tags.fee||"",
        access:tags.access||"",
        website:tags.website||"",
        opening_hours:tags.opening_hours||""
      });
    }
  });

  return [...byId.values()];
}
async function searchLive(lat,lon,radiusKm){
  const all=[];
  let successes=0, failures=0;

  if(radiusKm<=40){
    try{
      const data=await fetchOverpass(queryForRadius(lat,lon,radiusKm),12000);
      successes=1;
      all.push(...(data.elements||[]));
    }catch(e){
      failures=1;
    }
  }else{
    const boxes=buildBboxes(lat,lon,radiusKm);
    // Large searches run in parallel so the user doesn't wait for 4 x 12 seconds.
    const results=await Promise.all(boxes.map(async box=>{
      try{
        const data=await fetchOverpass(queryForBbox(box),12000);
        return {ok:true,elements:data.elements||[]};
      }catch(e){
        return {ok:false,elements:[]};
      }
    }));
    results.forEach(r=>{
      if(r.ok) successes++; else failures++;
      all.push(...r.elements);
    });
  }

  return {items:elementsToItems(all,lat,lon,radiusKm),successes,failures};
}

function fallbackFor(lat,lon,radiusKm){
  return FALLBACK_PLACES.map(p=>({
    ...p,
    distance:haversineKm(lat,lon,p.lat,p.lon),
    live:false
  })).filter(p=>p.distance<=radiusKm);
}

async function searchPlaces(){
  if(!userLocation) return;
  const {lat,lon}=userLocation;
  const radiusKm=Number(radiusEl.value);

  statusEl.textContent=radiusKm<=40 ? "🔎 Schnelle Live-Suche …" : "🔎 Große Suche wird aufgeteilt …";
  resultsEl.innerHTML='<div class="card">Live-Daten werden geladen …</div>';

  const live=await searchLive(lat,lon,radiusKm);
  let items=live.items;

  // Keep known places visible when live data is sparse.
  const liveKeys=new Set(items.map(p=>p.name+"|"+p.lat.toFixed(5)+"|"+p.lon.toFixed(5)));
  fallbackFor(lat,lon,radiusKm).forEach(p=>{
    const key=p.name+"|"+p.lat.toFixed(5)+"|"+p.lon.toFixed(5);
    if(!liveKeys.has(key)) items.push(p);
  });

  renderResults(items, live.successes, live.failures, radiusKm);
}

function useLocation(){
  if(!navigator.geolocation){
    statusEl.textContent="❌ Dein Browser unterstützt keine Standortabfrage.";
    return;
  }

  statusEl.textContent="📍 Standort wird ermittelt …";
  navigator.geolocation.getCurrentPosition(
    pos=>{
      userLocation={lat:pos.coords.latitude,lon:pos.coords.longitude};
      if(userMarker) map.removeLayer(userMarker);
      userMarker=L.marker([userLocation.lat,userLocation.lon]).addTo(map).bindPopup("Dein Standort");
      map.setView([userLocation.lat,userLocation.lon],10);
      searchPlaces();
    },
    err=>{
      statusEl.textContent="❌ Standort konnte nicht ermittelt werden. Bitte Standortfreigabe für diese Website erlauben.";
    },
    {enableHighAccuracy:true,timeout:15000,maximumAge:60000}
  );
}

locateBtn.addEventListener("click",useLocation);
document.getElementById("closeModal").addEventListener("click",()=>document.getElementById("modal").classList.add("hidden"));

initMap();
window.FKK_APP_VERSION = "v8";

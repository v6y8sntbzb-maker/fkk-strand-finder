const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter"
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
    resultsEl.innerHTML='<div class="card"><div class="muted">Keine passenden FKK-Orte im gewählten Radius gefunden.</div></div>';
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
      ${escapeHtml(p.label||"FKK-Hinweis")}${p.status?`<br>ℹ️ ${escapeHtml(p.status)}`:""}</div>
      <div class="source">${p.live ? "Quelle: OpenStreetMap / Overpass" : "Zusatzdaten: bekannte FKK-Orte"}</div>`;
    card.addEventListener("click",()=>map.setView([p.lat,p.lon],14));
    resultsEl.appendChild(card);
  });

  if(liveCount>0){
    statusEl.innerHTML=`✅ Live-OpenStreetMap: ${liveCount} FKK-Ort(e) gefunden.`
      + (failedParts?` <span class="muted">(${failedParts} Teilabfrage(n) waren nicht erreichbar.)</span>`:"");
  } else {
    statusEl.textContent="⚠️ Live-OpenStreetMap ist gerade nicht erreichbar. Bekannte FKK-Orte werden angezeigt.";
  }
}

function buildBboxes(lat,lon,radiusKm){
  // Four overlapping boxes cover the complete radius bounding square.
  const latDelta=radiusKm/111.32;
  const lonDelta=radiusKm/(111.32*Math.max(0.2,Math.cos(lat*Math.PI/180)));
  const halfLat=latDelta/2;
  const halfLon=lonDelta/2;
  const overlapLat=latDelta*0.08;
  const overlapLon=lonDelta*0.08;

  const south=lat-latDelta, north=lat+latDelta;
  const west=lon-lonDelta, east=lon+lonDelta;
  const midLat=lat, midLon=lon;

  return [
    [south, west, midLat+overlapLat, midLon+overlapLon],
    [south, midLon-overlapLon, midLat+overlapLat, east],
    [midLat-overlapLat, west, north, midLon+overlapLon],
    [midLat-overlapLat, midLon-overlapLon, north, east]
  ];
}

function queryForBbox(b){
  const [s,w,n,e]=b;
  return `[out:json][timeout:25];(
    nwr(${s},${w},${n},${e})["nudism"];
    nwr(${s},${w},${n},${e})["name"~"FKK|Freikörper|Nacktbad|Nacktbade|Nacktbadestrand|Nudist|Naturist",i];
    nwr(${s},${w},${n},${e})["official_name"~"FKK|Freikörper|Nacktbad|Nacktbade|Nudist|Naturist",i];
    nwr(${s},${w},${n},${e})["description"~"FKK|Freikörper|Nacktbad|Nacktbade|Nudist|Naturist",i];
  );out center tags;`;
}

async function fetchOverpass(query){
  let lastError=null;
  for(const endpoint of OVERPASS_ENDPOINTS){
    try{
      const controller=new AbortController();
      const timeout=setTimeout(()=>controller.abort(),30000);
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
  throw lastError || new Error("Keine Overpass-Datenquelle erreichbar");
}

async function searchLive(lat,lon,radiusKm){
  const boxes=buildBboxes(lat,lon,radiusKm);
  let successes=0, failures=0, all=[];

  // Sequential requests are gentler on public Overpass servers.
  for(const box of boxes){
    try{
      const data=await fetchOverpass(queryForBbox(box));
      successes++;
      if(data && Array.isArray(data.elements)) all.push(...data.elements);
    }catch(e){
      failures++;
    }
  }

  const byId=new Map();
  all.forEach(el=>{
    const c=centerOf(el);
    if(!c) return;
    const d=haversineKm(lat,lon,c[0],c[1]);
    if(d>radiusKm) return;

    const tags=el.tags||{};
    const name=tags.name||tags.official_name||tags.alt_name||"FKK-/Nacktbereich";
    const label=tags.nudism ? `nudism=${tags.nudism}` : "FKK-/Nacktbereich";
    const key=`${el.type}/${el.id}`;
    if(!byId.has(key)){
      byId.set(key,{name,lat:c[0],lon:c[1],label,status:tags.description||"",distance:d,live:true});
    }
  });

  return {items:[...byId.values()],successes,failures};
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

  statusEl.textContent="🔎 Suche in mehreren kleineren Bereichen …";
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

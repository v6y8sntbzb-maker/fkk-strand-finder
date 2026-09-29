const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter"
];

const FALLBACK_PLACES = [
  {
    id:"fallback-ricklingen",
    name:"Ricklinger Kiesteiche – Sieben-Meter-Teich",
    lat:52.3369, lon:9.7450,
    label:"FKK-Bereich ausgewiesen",
    description:"Die Region Hannover weist das Nordufer des Sieben-Meter-Teichs als FKK-Bereich aus.",
    status:"Aktuell besteht laut Region Hannover ein Badeverbot wegen Blaualgen (Stand 25.09.2026).",
    source:"https://www.hannover.de/Kultur-Freizeit/Freizeit-Sport/Sport/Bäderführer/Badeseen/Ricklinger-Kiesteiche"
  },
  {
    id:"fallback-inselsee",
    name:"Inselsee – FKK-Strand, Scharnebeck",
    lat:53.30388, lon:10.48878,
    label:"FKK-Strand",
    description:"Die Gemeinde Scharnebeck beschreibt am Inselsee ausdrücklich einen FKK-Strand.",
    status:"Öffentlich zugänglicher Inselsee; aktuelle Hinweise vor Ort beachten.",
    source:"https://gemeinde-scharnebeck.de/kultur-und-tourismus/inselsee/"
  },
  {
    id:"fallback-kennel",
    name:"Kennel-Bad, Braunschweig",
    lat:52.24216, lon:10.52115,
    label:"Abgetrennter FKK-Bereich",
    description:"Das Kennel-Bad bestätigt auf seiner offiziellen Website einen abgetrennten FKK-Bereich.",
    status:"Laut offizieller Website derzeit geschlossen bis Juni 2027.",
    source:"https://kennel-bad.de/"
  }
];

let map = L.map("map").setView([52.62,10.08],10);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom:19,
  attribution:"&copy; OpenStreetMap-Mitwirkende"
}).addTo(map);

let userMarker=null, userCircle=null, markers=[], currentLocation=null, places=[];
let requestTimer=null, requestId=0;

const radiusEl=document.getElementById("radius");
const radiusValueEl=document.getElementById("radiusValue");
const statusEl=document.getElementById("status");
const resultsEl=document.getElementById("results");
const countEl=document.getElementById("count");

radiusEl.addEventListener("input",()=>{
  radiusValueEl.textContent=radiusEl.value;
  if(currentLocation){
    clearTimeout(requestTimer);
    requestTimer=setTimeout(loadPlaces,700);
  }
});

document.getElementById("locateBtn").addEventListener("click",locate);
document.getElementById("closeModal").addEventListener("click",closeModal);
document.getElementById("modal").addEventListener("click",e=>{
  if(e.target.id==="modal") closeModal();
});

function setStatus(text,error=false){
  statusEl.textContent=text;
  statusEl.className="status"+(error?" error":"");
}

function locate(){
  if(!navigator.geolocation){
    setStatus("Dein Browser unterstützt keine Standortbestimmung.",true);
    return;
  }
  setStatus("📍 Standort wird ermittelt …");
  navigator.geolocation.getCurrentPosition(
    pos=>{
      currentLocation={lat:pos.coords.latitude,lon:pos.coords.longitude};
      map.setView([currentLocation.lat,currentLocation.lon],11);
      if(userMarker) map.removeLayer(userMarker);
      if(userCircle) map.removeLayer(userCircle);
      userMarker=L.marker([currentLocation.lat,currentLocation.lon]).addTo(map).bindPopup("Dein Standort");
      updateCircle();
      loadPlaces();
    },
    ()=>{
      setStatus("Standort konnte nicht ermittelt werden. Bitte Standortzugriff für Safari erlauben.",true);
    },
    {enableHighAccuracy:true,timeout:15000,maximumAge:60000}
  );
}

function updateCircle(){
  if(!currentLocation) return;
  if(userCircle) map.removeLayer(userCircle);
  userCircle=L.circle(
    [currentLocation.lat,currentLocation.lon],
    {radius:Number(radiusEl.value)*1000,color:"#1677ff",fillOpacity:0.05}
  ).addTo(map);
}

function clearMarkers(){
  markers.forEach(m=>map.removeLayer(m));
  markers=[];
}

function haversine(lat1,lon1,lat2,lon2){
  const R=6371;
  const dLat=(lat2-lat1)*Math.PI/180;
  const dLon=(lon2-lon1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+
    Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function escapeHtml(s=""){
  return String(s).replace(/[&<>"']/g,c=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}

function elementPoint(el){
  if(typeof el.lat==="number"&&typeof el.lon==="number")
    return {lat:el.lat,lon:el.lon};
  if(el.center&&typeof el.center.lat==="number"&&typeof el.center.lon==="number")
    return {lat:el.center.lat,lon:el.center.lon};
  return null;
}

function classify(tags){
  const nud=(tags.nudism||"").toLowerCase();
  const text=Object.values(tags).join(" ").toLowerCase();
  if(["yes","designated","obligatory"].includes(nud))
    return {label:"FKK ausgewiesen",score:100};
  if(["permissive","customary"].includes(nud))
    return {label:"FKK erlaubt/üblich",score:90};
  if(/\bfkk\b|freik[oö]rper|nacktbaden|nacktbad|nudist|naturist/.test(text))
    return {label:"FKK-Hinweis im OSM-Eintrag",score:75};
  return {label:"FKK-Hinweis",score:60};
}

async function fetchOverpass(query){
  let lastError=null;
  for(const endpoint of OVERPASS_ENDPOINTS){
    try{
      const controller=new AbortController();
      const timeout=setTimeout(()=>controller.abort(),35000);
      const response=await fetch(endpoint,{
        method:"POST",
        body:"data="+encodeURIComponent(query),
        signal:controller.signal,
        cache:"no-store"
      });
      clearTimeout(timeout);
      if(!response.ok) throw new Error("HTTP "+response.status);
      const text=await response.text();
      if(!text||text.trim().startsWith("<")) throw new Error("Keine JSON-Antwort");
      return JSON.parse(text);
    }catch(e){
      lastError=e;
    }
  }
  throw lastError||new Error("Keine Overpass-Datenquelle erreichbar");
}

function mergeFallbackPlaces(userLat,userLon){
  const maxKm=Number(radiusEl.value);
  for(const p of FALLBACK_PLACES){
    const distance=haversine(userLat,userLon,p.lat,p.lon);
    if(distance>maxKm) continue;
    const exists=places.some(x=>
      haversine(x.lat,x.lon,p.lat,p.lon)<0.8 ||
      x.name.toLowerCase()===p.name.toLowerCase()
    );
    if(exists) continue;
    places.push({
      ...p,
      distance,
      score:110,
      tags:{name:p.name,nudism:"yes",description:p.description,note:p.status},
      sourceType:"Zusatzdaten"
    });
  }
}

async function loadPlaces(){
  if(!currentLocation) return;
  const myRequest=++requestId;
  updateCircle();
  clearMarkers();
  setStatus("🔎 FKK-Orte werden gesucht …");

  const r=Number(radiusEl.value)*1000;
  const lat=currentLocation.lat,lon=currentLocation.lon;

  const query=`
[out:json][timeout:35];
(
  nwr(around:${r},${lat},${lon})["nudism"];
  nwr(around:${r},${lat},${lon})["name"~"FKK|Freikörper|Nacktbad|Nacktbade|Nacktbadestrand|Nudist|Naturist",i];
  nwr(around:${r},${lat},${lon})["official_name"~"FKK|Freikörper|Nacktbad|Nacktbade|Nudist|Naturist",i];
);
out center tags;
`;

  try{
    const data=await fetchOverpass(query);
    if(myRequest!==requestId) return;

    const seen=new Set();
    places=[];

    for(const el of(data.elements||[])){
      const point=elementPoint(el);
      if(!point) continue;
      const tags=el.tags||{};
      const key=(tags.name||"").trim().toLowerCase()+"|"+
        point.lat.toFixed(5)+"|"+point.lon.toFixed(5);
      if(seen.has(key)) continue;
      seen.add(key);

      const distance=haversine(lat,lon,point.lat,point.lon);
      if(distance>Number(radiusEl.value)+0.5) continue;

      const c=classify(tags);
      places.push({
        id:el.type+"/"+el.id,
        name:tags.name||"Unbenannter FKK-Ort",
        lat:point.lat,lon:point.lon,distance,
        tags,label:c.label,score:c.score,sourceType:"OpenStreetMap"
      });
    }

    mergeFallbackPlaces(lat,lon);
    places.sort((a,b)=>b.score-a.score||a.distance-b.distance);
    renderPlaces();
    setStatus(places.length
      ? `✅ ${places.length} FKK-Treffer im Umkreis von ${radiusEl.value} km.`
      : `Keine FKK-Treffer im Umkreis von ${radiusEl.value} km.`
    );
  }catch(e){
    if(myRequest!==requestId) return;

    places=[];
    mergeFallbackPlaces(lat,lon);
    places.sort((a,b)=>a.distance-b.distance);
    renderPlaces();

    if(places.length){
      setStatus(`⚠️ Live-OpenStreetMap ist gerade nicht erreichbar. ${places.length} bekannte FKK-Orte werden angezeigt.`);
    }else{
      setStatus("⚠️ Live-Daten sind gerade nicht erreichbar und im gewählten Radius sind keine Zusatzdaten vorhanden.",true);
    }
  }
}

function renderPlaces(){
  countEl.textContent=places.length;
  resultsEl.innerHTML="";

  places.forEach((p,index)=>{
    const marker=L.marker([p.lat,p.lon]).addTo(map);
    marker.bindPopup(
      `<strong>${escapeHtml(p.name)}</strong><br>${p.distance.toFixed(1)} km<br>${escapeHtml(p.label)}`
    );
    marker.on("click",()=>showDetails(index));
    markers.push(marker);

    const div=document.createElement("div");
    div.className="result";
    const nud=p.tags.nudism
      ? `<span class="tag">FKK</span>`:"";
    div.innerHTML=`
      <h3>${escapeHtml(p.name)}</h3>
      <p><strong>${p.distance.toFixed(1)} km</strong> · ${escapeHtml(p.label)}</p>
      <p>${nud}${p.sourceType==="Zusatzdaten"
        ? `<span class="tag">Zusatzdaten</span>`:""}</p>
      ${p.status?`<p>ℹ️ ${escapeHtml(p.status)}</p>`:""}
      <button type="button">Details</button>
    `;
    div.querySelector("button").addEventListener("click",()=>{
      map.setView([p.lat,p.lon],Math.max(map.getZoom(),13));
      showDetails(index);
    });
    resultsEl.appendChild(div);
  });

  if(!places.length){
    resultsEl.innerHTML="<p>Keine Treffer. Vergrößere den Radius oder versuche es später erneut.</p>";
  }
}

function showDetails(index){
  const p=places[index];
  if(!p) return;
  const t=p.tags;
  const website=t.website||t["contact:website"];
  const details=Object.entries(t)
    .filter(([k])=>!["name","website","contact:website"].includes(k))
    .slice(0,12)
    .map(([k,v])=>`<div><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}</div>`)
    .join("");

  document.getElementById("modalContent").innerHTML=`
    <h2>${escapeHtml(p.name)}</h2>
    <p><strong>${p.distance.toFixed(1)} km entfernt</strong></p>
    <p><span class="tag">${escapeHtml(p.label)}</span></p>
    ${p.status?`<p>ℹ️ ${escapeHtml(p.status)}</p>`:""}
    ${website?`<p><a href="${escapeHtml(website)}" target="_blank" rel="noopener">Website öffnen</a></p>`:""}
    ${p.source?`<p><a href="${escapeHtml(p.source)}" target="_blank" rel="noopener">Quelle öffnen</a></p>`:""}
    <hr>
    ${details||"<p>Keine weiteren Angaben vorhanden.</p>"}
    ${p.sourceType==="OpenStreetMap"
      ? `<p><a href="https://www.openstreetmap.org/${p.id}" target="_blank" rel="noopener">OpenStreetMap-Eintrag öffnen</a></p>`:""}
    <p><a href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}" target="_blank" rel="noopener">🧭 Route starten</a></p>
  `;
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal(){
  document.getElementById("modal").classList.add("hidden");
}

// FKK Strand Finder v14
// Statische FKK-Datenbasis. Die Suche kann vom GPS-Standort ODER von einem eingegebenen Ort starten.

const FKK_PLACES = [
  {
    name: "Altwarmbüchener See", lat: 52.4211, lon: 9.8506,
    label: "FKK erlaubt", type: "Badesee", evidence: "FKK-Verzeichnis", source: "Badesee-heute",
    sourceUrl: "https://badesee-heute.de/fkk/niedersachsen/",
    status: "FKK ist für den See in einem aktuellen FKK-Badesee-Verzeichnis verzeichnet."
  },
  {
    name: "Ricklinger Kiesteiche – Sieben-Meter-Teich", lat: 52.3369, lon: 9.7450,
    label: "FKK-Bereich ausgewiesen", type: "Badesee", evidence: "offizielle Quelle", source: "Region Hannover",
    sourceUrl: "https://www.hannover.de/Kultur-Freizeit/Naherholung/Raus-in-die-Natur/Seen/Ricklinger-Kiesteiche",
    status: "Das Nordufer des Sieben-Meter-Teichs ist als FKK-Bereich ausgewiesen."
  },
  {
    name: "Kennel-Bad", lat: 52.24216, lon: 10.52115,
    label: "Abgetrennter FKK-Bereich", type: "Naturbad", evidence: "offizielle Quelle", source: "Kennel-Bad / Badegewässer-Atlas",
    sourceUrl: "https://kennel-bad.de/", status: "Das Bad verfügt über einen abgetrennten FKK-Bereich."
  },
  {
    name: "Allersee Wolfsburg", lat: 52.43361, lon: 10.81917,
    label: "FKK erlaubt", type: "Badesee", evidence: "FKK-Verzeichnis", source: "Badesee-heute",
    sourceUrl: "https://badesee-heute.de/fkk/niedersachsen/", status: "Als Badesee mit FKK-Möglichkeit verzeichnet."
  },
  {
    name: "Oldenstädter See – Uelzen", lat: 52.9819, lon: 10.5903,
    label: "FKK", type: "Badesee", evidence: "FKK-Verzeichnis", source: "Badesee-Suche",
    sourceUrl: "https://www.badesee-suche.de/seen/fkk-seen/niedersachsen/", status: "Als Badesee mit FKK-Möglichkeit verzeichnet."
  },
  {
    name: "Fümmelsee – Wolfenbüttel", lat: 52.1679, lon: 10.5017,
    label: "FKK", type: "Naturbad", evidence: "FKK-Verzeichnis", source: "Badesee-Suche",
    sourceUrl: "https://www.badesee-suche.de/seen/fkk-seen/niedersachsen/", status: "Als Badesee mit FKK-Möglichkeit verzeichnet."
  },
  {
    name: "Inselsee – FKK-Strand", lat: 53.30388, lon: 10.48878,
    label: "FKK-Strand", type: "Badesee", evidence: "offizielle Quelle", source: "Gemeinde Scharnebeck",
    sourceUrl: "https://gemeinde-scharnebeck.de/kultur-und-tourismus/inselsee/", status: "Die Gemeinde nennt ausdrücklich einen FKK-Strand am Inselsee."
  },
  {
    name: "Pulvermühlenteich – Seevetal", lat: 53.41451, lon: 10.03654,
    label: "FKK", type: "See", evidence: "FKK-Verzeichnis", source: "Badesee-Suche",
    sourceUrl: "https://www.badesee-suche.de/seen/fkk-seen/niedersachsen/", status: "Als Badesee mit FKK-Möglichkeit verzeichnet."
  },
  {
    name: "Kiefhölzer Teich – Oberharz", lat: 51.8303, lon: 10.3686,
    label: "FKK", type: "Badesee", evidence: "FKK-Verzeichnis", source: "Badesee-heute",
    sourceUrl: "https://badesee-heute.de/fkk/niedersachsen/", status: "Als FKK-Badesee verzeichnet."
  }
];

let map;
let userMarker = null;
let resultMarkers = [];
let searchOrigin = null; // {lat, lon, label, kind}
let searchTimer = null;

const radiusEl = document.getElementById("radius");
const radiusValueEl = document.getElementById("radiusValue");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");
const locateBtn = document.getElementById("locateBtn");
const placeInput = document.getElementById("placeInput");
const placeSearchBtn = document.getElementById("placeSearchBtn");
const originInfoEl = document.getElementById("originInfo");

radiusEl.addEventListener("input", () => {
  radiusValueEl.textContent = radiusEl.value;
  if (searchOrigin) {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => searchPlaces(), 120);
  }
});

placeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchFromPlace();
});

function initMap(){
  if (typeof L === "undefined") {
    document.getElementById("map").innerHTML = '<div style="padding:20px;font-size:15px">⚠️ Die Kartenbibliothek konnte nicht geladen werden. Bitte die Seite einmal neu laden.</div>';
    return;
  }
  map = L.map("map").setView([52.62,10.08], 9);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom:19, attribution:"© OpenStreetMap-Mitwirkende"
  }).addTo(map);
}

function haversineKm(aLat,aLon,bLat,bLon){
  const R=6371;
  const dLat=(bLat-aLat)*Math.PI/180;
  const dLon=(bLon-aLon)*Math.PI/180;
  const x=Math.sin(dLat/2)**2 + Math.cos(aLat*Math.PI/180)*Math.cos(bLat*Math.PI/180)*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(x));
}

function escapeHtml(s){
  return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
}

function clearMarkers(){
  resultMarkers.forEach(m=>map.removeLayer(m));
  resultMarkers=[];
}

function showOrigin(origin){
  if (userMarker) map.removeLayer(userMarker);
  userMarker=L.marker([origin.lat,origin.lon]).addTo(map).bindPopup(`<strong>Suchort</strong><br>${escapeHtml(origin.label)}`);
  originInfoEl.classList.remove("hidden");
  originInfoEl.innerHTML = `🔎 Suche ab <strong>${escapeHtml(origin.label)}</strong> <button id="clearOrigin" type="button">×</button>`;
  document.getElementById("clearOrigin").addEventListener("click", clearOrigin);
}

function clearOrigin(){
  searchOrigin=null;
  if (userMarker) { map.removeLayer(userMarker); userMarker=null; }
  originInfoEl.classList.add("hidden");
  statusEl.textContent="Wähle deinen Standort oder gib einen Ort ein.";
  resultsEl.innerHTML="";
  clearMarkers();
}

function navigationLinks(p){
  const apple=`maps://?daddr=${encodeURIComponent(p.lat+","+p.lon)}`;
  const google=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.lat+","+p.lon)}`;
  return `<div class="navButtons"><a class="navBtn" href="${apple}"> Apple Karten</a><a class="navBtn" href="${google}" target="_blank" rel="noopener">🗺️ Google Maps</a></div>`;
}

function renderResults(items, radius){
  clearMarkers();
  resultsEl.innerHTML="";
  items.sort((a,b)=>a.distance-b.distance);

  if (!items.length){
    statusEl.textContent=`ℹ️ Keine FKK-Orte innerhalb von ${radius} km in der lokalen Datenbank.`;
    resultsEl.innerHTML='<div class="card"><div class="muted">Keine passenden FKK-Orte im gewählten Radius gefunden.</div><div class="source">Tipp: Größeren Suchradius wählen.</div></div>';
    return;
  }

  items.forEach((p)=>{
    const marker=L.marker([p.lat,p.lon]).addTo(map);
    marker.bindPopup(`<strong>${escapeHtml(p.name)}</strong><br>${escapeHtml(p.label)}<br>${p.distance.toFixed(1)} km`);
    resultMarkers.push(marker);

    const sourceLink = p.sourceUrl ? `<a href="${escapeHtml(p.sourceUrl)}" target="_blank" rel="noopener">${escapeHtml(p.source)}</a>` : escapeHtml(p.source||"");
    const card=document.createElement("div");
    card.className="card";
    card.innerHTML=`
      <h3>${escapeHtml(p.name)}</h3>
      <div class="meta">📍 ${p.distance.toFixed(1)} km entfernt<br>
      <strong>${escapeHtml(p.label)}</strong> · ${escapeHtml(p.type)}<br>
      ℹ️ ${escapeHtml(p.status)}</div>
      <div class="source">Quelle: ${sourceLink}<br>Einordnung: ${escapeHtml(p.evidence)}</div>
      ${navigationLinks(p)}`;
    card.addEventListener("click",(event)=>{
      if(event.target.closest("a")) return;
      map.setView([p.lat,p.lon],14);
      marker.openPopup();
    });
    resultsEl.appendChild(card);
  });

  const official=items.filter(p=>p.evidence==="offizielle Quelle").length;
  statusEl.innerHTML=`✅ ${items.length} FKK-Ort(e) innerhalb von ${radius} km gefunden. <span class="statusSmall">Davon ${official} mit offizieller Quelle.</span>`;
}

function searchPlaces(){
  if(!searchOrigin) return;
  const {lat,lon}=searchOrigin;
  const radiusKm=Number(radiusEl.value);
  statusEl.textContent="🔎 Suche in der lokalen FKK-Datenbank …";
  resultsEl.innerHTML='<div class="card">Orte werden nach Entfernung sortiert …</div>';

  const items=FKK_PLACES.map(p=>({...p,distance:haversineKm(lat,lon,p.lat,p.lon)})).filter(p=>p.distance<=radiusKm);
  renderResults(items,radiusKm);
}

function useLocation(){
  if(!navigator.geolocation){
    statusEl.textContent="❌ Dein Browser unterstützt keine Standortabfrage.";
    return;
  }
  statusEl.textContent="📍 Standort wird ermittelt …";
  navigator.geolocation.getCurrentPosition(
    pos=>{
      searchOrigin={lat:pos.coords.latitude,lon:pos.coords.longitude,label:"Mein aktueller Standort",kind:"gps"};
      placeInput.value="";
      showOrigin(searchOrigin);
      map.setView([searchOrigin.lat,searchOrigin.lon],10);
      searchPlaces();
    },
    ()=>{ statusEl.textContent="❌ Standort konnte nicht ermittelt werden. Bitte Standortfreigabe für diese Website erlauben."; },
    {enableHighAccuracy:true,timeout:15000,maximumAge:60000}
  );
}

async function searchFromPlace(){
  const q=placeInput.value.trim();
  if(!q){ statusEl.textContent="Bitte zuerst einen Ort oder eine Adresse eingeben."; placeInput.focus(); return; }
  placeSearchBtn.disabled=true;
  statusEl.textContent="🔎 Ort wird gesucht …";
  try{
    const url=`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=de&accept-language=de&q=${encodeURIComponent(q)}`;
    const res=await fetch(url,{headers:{"Accept":"application/json"}});
    if(!res.ok) throw new Error("Geocoding failed");
    const data=await res.json();
    if(!data.length){
      statusEl.textContent="❌ Ort nicht gefunden. Bitte z. B. Stadt oder vollständige Adresse eingeben.";
      return;
    }
    const r=data[0];
    searchOrigin={lat:Number(r.lat),lon:Number(r.lon),label:r.display_name,kind:"place"};
    showOrigin(searchOrigin);
    map.setView([searchOrigin.lat,searchOrigin.lon],10);
    searchPlaces();
  }catch(e){
    statusEl.textContent="❌ Die Ortssuche ist gerade nicht erreichbar. Bitte später noch einmal versuchen.";
  }finally{
    placeSearchBtn.disabled=false;
  }
}

locateBtn.addEventListener("click",useLocation);
placeSearchBtn.addEventListener("click",searchFromPlace);
document.getElementById("closeModal").addEventListener("click",()=>document.getElementById("modal").classList.add("hidden"));

initMap();
window.FKK_APP_VERSION = "v14";

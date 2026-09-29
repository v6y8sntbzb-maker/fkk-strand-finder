const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter"
];

let map = L.map("map").setView([52.62, 10.08], 10);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap-Mitwirkende'
}).addTo(map);

let userMarker = null;
let userCircle = null;
let markers = [];
let currentLocation = null;
let places = [];
let requestTimer = null;
let requestId = 0;

const radiusEl = document.getElementById("radius");
const radiusValueEl = document.getElementById("radiusValue");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");
const countEl = document.getElementById("count");

radiusEl.addEventListener("input", () => {
  radiusValueEl.textContent = radiusEl.value;
  if (currentLocation) {
    clearTimeout(requestTimer);
    requestTimer = setTimeout(loadPlaces, 500);
  }
});

document.getElementById("locateBtn").addEventListener("click", locate);
document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("modal").addEventListener("click", e => {
  if (e.target.id === "modal") closeModal();
});

function setStatus(text, error=false) {
  statusEl.textContent = text;
  statusEl.className = "status" + (error ? " error" : "");
}

function locate() {
  if (!navigator.geolocation) {
    setStatus("Dein Browser unterstützt keine Standortbestimmung.", true);
    return;
  }
  setStatus("📍 Standort wird ermittelt …");
  navigator.geolocation.getCurrentPosition(
    pos => {
      currentLocation = {lat: pos.coords.latitude, lon: pos.coords.longitude};
      map.setView([currentLocation.lat, currentLocation.lon], 11);
      if (userMarker) map.removeLayer(userMarker);
      if (userCircle) map.removeLayer(userCircle);
      userMarker = L.marker([currentLocation.lat, currentLocation.lon]).addTo(map).bindPopup("Dein Standort");
      updateCircle();
      loadPlaces();
    },
    err => {
      setStatus("Standort konnte nicht ermittelt werden. Bitte Standortzugriff für Safari erlauben.", true);
    },
    {enableHighAccuracy:true, timeout:15000, maximumAge:60000}
  );
}

function updateCircle() {
  if (!currentLocation) return;
  if (userCircle) map.removeLayer(userCircle);
  userCircle = L.circle([currentLocation.lat, currentLocation.lon], {
    radius: Number(radiusEl.value) * 1000,
    color: "#1677ff",
    fillOpacity: 0.05
  }).addTo(map);
}

function clearMarkers() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLon = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(dLat/2)**2 +
            Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function escapeHtml(s="") {
  return String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}

function elementPoint(el) {
  if (typeof el.lat === "number" && typeof el.lon === "number") return {lat:el.lat, lon:el.lon};
  if (el.center && typeof el.center.lat === "number" && typeof el.center.lon === "number")
    return {lat:el.center.lat, lon:el.center.lon};
  return null;
}

function classify(tags) {
  const nud = (tags.nudism || "").toLowerCase();
  const text = Object.values(tags).join(" ").toLowerCase();

  if (["yes","designated","obligatory"].includes(nud))
    return {label:"FKK ausgewiesen", score:100};
  if (["permissive","customary"].includes(nud))
    return {label:"FKK erlaubt/üblich", score:90};
  if (/\bfkk\b|freik[oö]rper|nacktbaden|nacktbad|nudist|naturist/.test(text))
    return {label:"FKK-Hinweis im OSM-Eintrag", score:75};
  return {label:"Bade-/Strandtreffer", score:30};
}

async function fetchOverpass(query) {
  let lastError = null;

  // GET ist für eine statische GitHub-Pages-App auf mobilen Browsern
  // robuster als die bisherige POST-Variante.
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000);
      const url = endpoint + "?data=" + encodeURIComponent(query);
      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        cache: "no-store",
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (!response.ok) throw new Error("HTTP " + response.status);
      const text = await response.text();

      if (!text || text.trim().startsWith("<")) {
        throw new Error("Ungültige Antwort des Overpass-Servers");
      }
      return JSON.parse(text);
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError || new Error("Keine Datenquelle erreichbar");
}

async function loadPlaces() {
  if (!currentLocation) return;
  const myRequest = ++requestId;
  updateCircle();
  setStatus("🔎 Suche in OpenStreetMap …");
  clearMarkers();

  const r = Number(radiusEl.value) * 1000;
  const lat = currentLocation.lat;
  const lon = currentLocation.lon;

  // FKK-fokussierte Suche: deutlich kleiner als eine Abfrage
  // aller Badeseen im 100-km-Radius.
  const query = `
[out:json][timeout:45];
(
  nwr(around:${r},${lat},${lon})["nudism"];
  nwr(around:${r},${lat},${lon})["name"~"FKK|Freikörper|Nacktbad|Nacktbade|Nacktbadestrand|Nudist|Naturist",i];
  nwr(around:${r},${lat},${lon})["description"~"FKK|Freikörper|Nacktbad|Nacktbade|Nacktbadestrand|Nudist|Naturist",i];
  nwr(around:${r},${lat},${lon})["note"~"FKK|Freikörper|Nacktbad|Nacktbade|Nudist|Naturist",i];
  nwr(around:${r},${lat},${lon})["official_name"~"FKK|Freikörper|Nacktbad|Nacktbade|Nudist|Naturist",i];
);
out center tags;
`;
;
    div.querySelector("button").addEventListener("click", () => {
      map.setView([p.lat,p.lon], Math.max(map.getZoom(),13));
      showDetails(index);
    });
    resultsEl.appendChild(div);
  });

  if (!places.length) {
    resultsEl.innerHTML = `<p>Keine Treffer. Vergrößere den Radius oder versuche es später erneut.</p>`;
  }
}

function showDetails(index) {
  const p = places[index];
  if (!p) return;
  const t = p.tags;
  const website = t.website || t["contact:website"];
  const details = Object.entries(t)
    .filter(([k]) => !["name","website","contact:website"].includes(k))
    .slice(0,12)
    .map(([k,v]) => `<div><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}</div>`)
    .join("");

  document.getElementById("modalContent").innerHTML = `
    <h2>${escapeHtml(p.name)}</h2>
    <p><strong>${p.distance.toFixed(1)} km entfernt</strong></p>
    <p><span class="tag">${escapeHtml(p.label)}</span></p>
    ${website ? `<p><a href="${escapeHtml(website)}" target="_blank" rel="noopener">Website öffnen</a></p>` : ""}
    <hr>
    ${details || "<p>Keine weiteren Angaben in OpenStreetMap.</p>"}
    <p style="margin-top:15px">
      <a href="https://www.openstreetmap.org/${p.id}" target="_blank" rel="noopener">OpenStreetMap-Eintrag öffnen</a>
    </p>
    <p>
      <a href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}" target="_blank" rel="noopener">🧭 Route starten</a>
    </p>
  `;
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

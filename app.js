const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter"
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
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const response = await fetch(endpoint, {
        method:"POST",
        headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
        body:"data="+encodeURIComponent(query),
        signal:controller.signal
      });
      clearTimeout(timeout);
      if (!response.ok) throw new Error("HTTP "+response.status);
      return await response.json();
    } catch(e) {
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

  // Breite Suche: FKK-Tags + Badestellen/Strände, damit nicht nur exakt
  // "nudism=yes" gefunden wird.
  const query = `
[out:json][timeout:30];
(
  nwr(around:${r},${lat},${lon})["nudism"];
  nwr(around:${r},${lat},${lon})["name"~"FKK|Freikörper|Nacktbad|Nacktbade|Nudist|Naturist",i];
  nwr(around:${r},${lat},${lon})["description"~"FKK|Freikörper|Nacktbad|Nacktbade|Nudist|Naturist",i];
  nwr(around:${r},${lat},${lon})["leisure"="bathing_place"];
  nwr(around:${r},${lat},${lon})["leisure"="beach"];
  nwr(around:${r},${lat},${lon})["leisure"="beach_resort"];
  nwr(around:${r},${lat},${lon})["leisure"="swimming_area"];
  nwr(around:${r},${lat},${lon})["natural"="beach"];
);
out center tags;
`;

  try {
    const data = await fetchOverpass(query);
    if (myRequest !== requestId) return;

    const seen = new Set();
    places = [];

    for (const el of (data.elements || [])) {
      const point = elementPoint(el);
      if (!point) continue;
      const tags = el.tags || {};
      const key = (tags.name || "").trim().toLowerCase() + "|" + point.lat.toFixed(5) + "|" + point.lon.toFixed(5);
      if (seen.has(key)) continue;
      seen.add(key);

      const distance = haversine(lat, lon, point.lat, point.lon);
      if (distance > Number(radiusEl.value) + 0.5) continue;

      const classification = classify(tags);
      places.push({
        id: el.type + "/" + el.id,
        name: tags.name || "Unbenannte Badestelle",
        lat: point.lat,
        lon: point.lon,
        distance,
        tags,
        label: classification.label,
        score: classification.score
      });
    }

    // FKK-Hinweise zuerst, danach Entfernung.
    places.sort((a,b) => b.score-a.score || a.distance-b.distance);
    renderPlaces();
    setStatus(places.length
      ? `✅ ${places.length} Einträge im Umkreis von ${radiusEl.value} km gefunden.`
      : `Keine passenden OSM-Einträge im Umkreis von ${radiusEl.value} km. Das kann an unvollständigen OSM-Daten liegen.`
    );
  } catch (e) {
    if (myRequest !== requestId) return;
    setStatus("Die OpenStreetMap-Suche konnte gerade nicht geladen werden. Bitte später erneut versuchen.", true);
    resultsEl.innerHTML = `<p class="hint">Technischer Fehler bei der Datenabfrage. Prüfe auch deine Internetverbindung.</p>`;
    countEl.textContent = "0";
  }
}

function renderPlaces() {
  countEl.textContent = places.length;
  resultsEl.innerHTML = "";

  places.forEach((p, index) => {
    const marker = L.marker([p.lat,p.lon]).addTo(map);
    marker.bindPopup(`<strong>${escapeHtml(p.name)}</strong><br>${p.distance.toFixed(1)} km<br>${escapeHtml(p.label)}`);
    marker.on("click", () => showDetails(index));
    markers.push(marker);

    const div = document.createElement("div");
    div.className = "result";
    const access = p.tags.access ? `<span class="tag">Zugang: ${escapeHtml(p.tags.access)}</span>` : "";
    const nud = p.tags.nudism ? `<span class="tag">nudism=${escapeHtml(p.tags.nudism)}</span>` : "";
    div.innerHTML = `
      <h3>${escapeHtml(p.name)}</h3>
      <p><strong>${p.distance.toFixed(1)} km</strong> · ${escapeHtml(p.label)}</p>
      <p>${access}${nud}</p>
      <button type="button">Details</button>
    `;
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

const places = [
  { id: 1, name: "FKK Strand Beispiel Nord", lat: 53.5511, lon: 9.9937,
    description: "Beispieldatensatz. Dieser Ort dient nur zum Testen der App.",
    type: "Beispiel" },
  { id: 2, name: "FKK Strand Beispiel See", lat: 52.5200, lon: 13.4050,
    description: "Beispieldatensatz für die Kartenansicht.",
    type: "Beispiel" },
  { id: 3, name: "FKK Strand Beispiel Süd", lat: 50.1109, lon: 8.6821,
    description: "Beispieldatensatz für die Umkreissuche.",
    type: "Beispiel" }
];

let userLocation = null;
let map;
let userMarker;
let radiusCircle;
let placeMarkers = [];

const radiusInput = document.getElementById("radius");
const radiusValue = document.getElementById("radiusValue");
const statusEl = document.getElementById("status");
const placesEl = document.getElementById("places");
const resultCount = document.getElementById("resultCount");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");

function initMap() {
  map = L.map("map").setView([51.1657, 10.4515], 6);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap-Mitwirkende"
  }).addTo(map);
}

function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getFilteredPlaces() {
  if (!userLocation) return [];
  const radius = Number(radiusInput.value);
  return places
    .map(p => ({ ...p, distance: distanceKm(userLocation.lat, userLocation.lon, p.lat, p.lon) }))
    .filter(p => p.distance <= radius)
    .sort((a, b) => a.distance - b.distance);
}

function updateMapAndList() {
  placeMarkers.forEach(m => map.removeLayer(m));
  placeMarkers = [];

  const results = getFilteredPlaces();
  resultCount.textContent = `${results.length} gefunden`;

  if (userLocation) {
    const radiusMeters = Number(radiusInput.value) * 1000;
    if (radiusCircle) map.removeLayer(radiusCircle);
    radiusCircle = L.circle([userLocation.lat, userLocation.lon], {
      radius: radiusMeters, color: "#0f766e", fillColor: "#0f766e",
      fillOpacity: 0.10, weight: 2
    }).addTo(map);
  }

  results.forEach(p => {
    const marker = L.marker([p.lat, p.lon]).addTo(map);
    marker.bindPopup(`<strong>🏖️ ${escapeHtml(p.name)}</strong><br>${p.distance.toFixed(1)} km`);
    marker.on("click", () => showPlace(p));
    placeMarkers.push(marker);
  });

  placesEl.innerHTML = results.length ? results.map(p => `
    <article class="place">
      <h3>🏖️ ${escapeHtml(p.name)}</h3>
      <p class="distance">${p.distance.toFixed(1)} km entfernt</p>
      <p>${escapeHtml(p.description)}</p>
      <button onclick="showPlaceById(${p.id})">Details</button>
    </article>
  `).join("") : `
    <div class="place">
      <p>${userLocation ? "Keine Beispieldaten in diesem Umkreis. Später werden hier echte FKK-Strände angezeigt." : "Bitte zuerst deinen Standort freigeben."}</p>
    </div>`;
}

function locate() {
  if (!navigator.geolocation) {
    statusEl.textContent = "Dein Browser unterstützt keine Standortbestimmung.";
    return;
  }

  statusEl.textContent = "Standort wird ermittelt …";

  navigator.geolocation.getCurrentPosition(
    pos => {
      userLocation = { lat: pos.coords.latitude, lon: pos.coords.longitude };

      if (userMarker) map.removeLayer(userMarker);
      userMarker = L.marker([userLocation.lat, userLocation.lon])
        .addTo(map)
        .bindPopup("📍 Dein Standort");

      map.setView([userLocation.lat, userLocation.lon], 11);
      statusEl.textContent = "Standort gefunden.";
      updateMapAndList();
    },
    err => {
      const messages = {
        1: "Standortfreigabe wurde abgelehnt.",
        2: "Standort konnte nicht ermittelt werden.",
        3: "Zeitüberschreitung bei der Standortabfrage."
      };
      statusEl.textContent = messages[err.code] || "Standort konnte nicht ermittelt werden.";
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
  );
}

function showPlaceById(id) {
  const p = places.find(x => x.id === id);
  if (p) {
    p.distance = userLocation ? distanceKm(userLocation.lat, userLocation.lon, p.lat, p.lon) : null;
    showPlace(p);
  }
}

function showPlace(p) {
  const distanceText = p.distance == null ? "" : `<p><strong>Entfernung:</strong> ${p.distance.toFixed(1)} km</p>`;
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}`;

  modalContent.innerHTML = `
    <h2>🏖️ ${escapeHtml(p.name)}</h2>
    <p>${escapeHtml(p.description)}</p>
    ${distanceText}
    <p><strong>Status:</strong> ${escapeHtml(p.type)}</p>
    <a class="route" target="_blank" rel="noopener" href="${mapsUrl}">🧭 Route öffnen</a>
  `;
  modal.classList.remove("hidden");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[c]));
}

radiusInput.addEventListener("input", () => {
  radiusValue.textContent = `${radiusInput.value} km`;
  updateMapAndList();
});
document.getElementById("locationBtn").addEventListener("click", locate);
document.getElementById("locateBtn").addEventListener("click", locate);
document.getElementById("closeModal").addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", e => { if (e.target === modal) modal.classList.add("hidden"); });

initMap();
updateMapAndList();

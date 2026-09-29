const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter'
];

const map = L.map('map').setView([52.62, 10.08], 10);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap-Mitwirkende'
}).addTo(map);

let userMarker = null;
let radiusCircle = null;
let resultMarkers = [];
let currentPosition = null;
let currentResults = [];
let requestTimer = null;

const radiusEl = document.getElementById('radius');
const radiusValue = document.getElementById('radiusValue');
const statusEl = document.getElementById('status');
const resultsEl = document.getElementById('results');
const countEl = document.getElementById('count');

function setStatus(text, type='') {
  statusEl.textContent = text;
  statusEl.className = 'status ' + type;
}

function escapeHtml(value='') {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLon = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function coordsFor(el) {
  if (typeof el.lat === 'number' && typeof el.lon === 'number') return [el.lat, el.lon];
  if (el.center && typeof el.center.lat === 'number' && typeof el.center.lon === 'number') return [el.center.lat, el.center.lon];
  return null;
}

function confidenceFor(tags) {
  const nudism = (tags.nudism || '').toLowerCase();
  const name = (tags.name || '').toLowerCase();
  const fkkText = /fkk|nackt|nudist|naturist|naturismus|freik.rperkultur/.test(name);
  if (['obligatory','designated'].includes(nudism)) return 'FKK ausgewiesen';
  if (['yes','permissive','customary'].includes(nudism)) return 'Nudismus in OSM angegeben';
  if (tags.club === 'nudism') return 'Nudismus-Club';
  if (fkkText) return 'FKK-Hinweis im Namen';
  return 'FKK-/Nudismus-Hinweis';
}

function buildQuery(lat, lon, radiusM) {
  return `[out:json][timeout:30];(
    nwr(around:${radiusM},${lat},${lon})["nudism"~"^(yes|obligatory|designated|customary|permissive)$",i];
    nwr(around:${radiusM},${lat},${lon})["club"="nudism"];
    nwr(around:${radiusM},${lat},${lon})["name"~"FKK|Freik.rperkultur|Nackt|Nudist|Naturist|Naturismus",i];
    nwr(around:${radiusM},${lat},${lon})["fkk"];
    nwr(around:${radiusM},${lat},${lon})["naturism"];
  );out center tags;`;
}

async function fetchOverpass(query) {
  let lastError = null;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 35000);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},
        body: 'data=' + encodeURIComponent(query),
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('Overpass nicht erreichbar');
}

function normalizeResults(data) {
  const seen = new Set();
  return (data.elements || []).map(el => {
    const coords = coordsFor(el);
    if (!coords) return null;
    const tags = el.tags || {};
    const key = `${el.type}/${el.id}`;
    if (seen.has(key)) return null;
    seen.add(key);
    return {
      id: key,
      name: tags.name || 'FKK-/Nudismus-Ort ohne Namen',
      lat: coords[0], lon: coords[1],
      tags,
      type: el.type,
      confidence: confidenceFor(tags)
    };
  }).filter(Boolean);
}

function clearMarkers() {
  resultMarkers.forEach(m => map.removeLayer(m));
  resultMarkers = [];
}

function renderResults(results) {
  clearMarkers();
  countEl.textContent = results.length;
  if (!results.length) {
    resultsEl.innerHTML = '<div class="empty"><strong>Keine Treffer im gewählten Radius.</strong><br><br>Das bedeutet nicht automatisch, dass es dort keinen FKK-Ort gibt. Es kann sein, dass der Ort noch nicht passend in OpenStreetMap erfasst ist.</div>';
    return;
  }

  results.forEach((place, index) => {
    const marker = L.marker([place.lat, place.lon]).addTo(map).bindPopup(`<strong>${escapeHtml(place.name)}</strong><br>${escapeHtml(place.confidence)}`);
    marker.on('click', () => openDetails(index));
    resultMarkers.push(marker);
  });

  resultsEl.innerHTML = results.map((p, i) => {
    const distance = currentPosition ? distanceKm(currentPosition.lat,currentPosition.lon,p.lat,p.lon) : null;
    const website = p.tags.website || p.tags['contact:website'];
    return `<article class="card">
      <span class="badge">${escapeHtml(p.confidence)}</span>
      <h3>${escapeHtml(p.name)}</h3>
      ${distance !== null ? `<div class="meta">📏 ${distance.toFixed(1)} km entfernt</div>` : ''}
      ${p.tags.nudism ? `<div class="meta">OSM nudism: <span class="tag">${escapeHtml(p.tags.nudism)}</span></div>` : ''}
      ${p.tags.description ? `<div class="meta">${escapeHtml(p.tags.description)}</div>` : ''}
      <div class="actions">
        <button onclick="openDetails(${i})">Details</button>
        <a target="_blank" rel="noopener" href="https://www.openstreetmap.org/${p.type}/${p.id.split('/')[1]}">OSM</a>
        <a target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}">Route</a>
      </div>
      ${website ? `<div class="meta" style="margin-top:10px"><a target="_blank" rel="noopener" href="${escapeHtml(website)}">Website</a></div>` : ''}
    </article>`;
  }).join('');
}

function openDetails(index) {
  const p = currentResults[index];
  if (!p) return;
  const tags = Object.entries(p.tags).sort((a,b)=>a[0].localeCompare(b[0]));
  document.getElementById('modalContent').innerHTML = `
    <h2>${escapeHtml(p.name)}</h2>
    <p><strong>${escapeHtml(p.confidence)}</strong></p>
    <p>Entfernung: ${currentPosition ? distanceKm(currentPosition.lat,currentPosition.lon,p.lat,p.lon).toFixed(1)+' km' : '–'}</p>
    <p><a target="_blank" rel="noopener" href="https://www.openstreetmap.org/${p.type}/${p.id.split('/')[1]}">In OpenStreetMap öffnen</a></p>
    <h3>OSM-Daten</h3>
    <p>${tags.map(([k,v])=>`<span class="tag">${escapeHtml(k)}=${escapeHtml(v)}</span>`).join(' ')}</p>`;
  document.getElementById('modal').classList.remove('hidden');
}
window.openDetails = openDetails;

document.getElementById('closeModal').onclick = () => document.getElementById('modal').classList.add('hidden');
document.getElementById('modal').addEventListener('click', e => { if (e.target.id === 'modal') e.target.classList.add('hidden'); });

function updateMapArea() {
  if (!currentPosition) return;
  const radiusM = Number(radiusEl.value) * 1000;
  if (radiusCircle) map.removeLayer(radiusCircle);
  radiusCircle = L.circle([currentPosition.lat,currentPosition.lon], {radius:radiusM, weight:1, fillOpacity:0.04}).addTo(map);
}

async function loadPlaces() {
  if (!currentPosition) return;
  const radiusKm = Number(radiusEl.value);
  updateMapArea();
  setStatus(`Suche FKK-/Nudismus-Orte im Umkreis von ${radiusKm} km …`);
  const query = buildQuery(currentPosition.lat, currentPosition.lon, radiusKm * 1000);
  try {
    const data = await fetchOverpass(query);
    const results = normalizeResults(data).filter(p => distanceKm(currentPosition.lat,currentPosition.lon,p.lat,p.lon) <= radiusKm + 0.2);
    results.sort((a,b) => distanceKm(currentPosition.lat,currentPosition.lon,a.lat,a.lon) - distanceKm(currentPosition.lat,currentPosition.lon,b.lat,b.lon));
    currentResults = results;
    renderResults(results);
    setStatus(`${results.length} Treffer aus OpenStreetMap gefunden.`, 'ok');
  } catch (err) {
    currentResults = [];
    renderResults([]);
    setStatus('Die OSM-Suche konnte gerade nicht geladen werden. Bitte später erneut versuchen.', 'error');
  }
}

function requestLocation() {
  if (!navigator.geolocation) {
    setStatus('Dieser Browser unterstützt keine Standortbestimmung.', 'error');
    return;
  }
  setStatus('Standort wird ermittelt …');
  navigator.geolocation.getCurrentPosition(pos => {
    currentPosition = {lat:pos.coords.latitude, lon:pos.coords.longitude};
    if (userMarker) map.removeLayer(userMarker);
    userMarker = L.marker([currentPosition.lat,currentPosition.lon]).addTo(map).bindPopup('Dein Standort');
    map.setView([currentPosition.lat,currentPosition.lon], 11);
    loadPlaces();
  }, err => {
    setStatus('Standort konnte nicht ermittelt werden. Bitte in Safari den Standortzugriff für diese Website erlauben.', 'error');
  }, {enableHighAccuracy:true, timeout:15000, maximumAge:60000});
}

document.getElementById('locateBtn').addEventListener('click', requestLocation);
radiusEl.addEventListener('input', () => {
  radiusValue.textContent = radiusEl.value;
  if (!currentPosition) return;
  clearTimeout(requestTimer);
  requestTimer = setTimeout(loadPlaces, 650);
});

radiusValue.textContent = radiusEl.value;
setStatus('Tippe auf „Meinen Standort verwenden“, damit echte OpenStreetMap-Daten gesucht werden.');

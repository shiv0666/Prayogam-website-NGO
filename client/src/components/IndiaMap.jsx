import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon paths broken by bundlers
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Category accent colours
const categoryColors = {
  Education: '#2563eb',
  Social: '#10b981',
  Environment: '#16a34a',
  Healthcare: '#f97316'
};

const IndiaMap = ({ programs = [] }) => {
  const pins = programs.filter((p) => p.lat && p.lng);

  return (
    <div className="india-map-shell">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ height: '440px', width: '100%', borderRadius: '1.35rem' }}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pins.map((program) => (
          <Marker key={program._id} position={[program.lat, program.lng]} icon={defaultIcon}>
            <Popup>
              <div style={{ minWidth: 160 }}>
                <strong style={{ color: categoryColors[program.category] || '#2563eb', fontSize: '0.95rem' }}>
                  {program.title}
                </strong>
                {program.mapLocation && (
                  <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: 4 }}>
                    📍 {program.mapLocation}
                  </div>
                )}
                {program.description && (
                  <div style={{ color: '#475569', fontSize: '0.82rem', marginTop: 6, lineHeight: 1.4 }}>
                    {program.description.slice(0, 100)}{program.description.length > 100 ? '…' : ''}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        {pins.length === 0 && null}
      </MapContainer>
      {pins.length === 0 && (
        <div className="india-map-empty">
          <span>📍</span>
          <p>Program locations will appear here once the admin marks them on the map.</p>
        </div>
      )}
    </div>
  );
};

export default IndiaMap;

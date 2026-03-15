import { MapPin } from 'lucide-react';
import { MapContainer as LeafletMap, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapContainer() {
  // Coordinates for Chiclayo, Peru
  const center: [number, number] = [-6.7714, -79.8409];

  return (
    <div className="absolute inset-0 z-0 bg-[#e5e3df] overflow-hidden">
      <LeafletMap 
        center={center} 
        zoom={15} 
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
      </LeafletMap>

      {/* Center Marker Overlay (Fixed to screen center) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-[400]">
        <div className="bg-tico-black text-white text-xs font-bold px-3 py-1.5 rounded-full mb-1 shadow-lg">
          Tu ubicación
        </div>
        <MapPin className="w-10 h-10 text-tico-black fill-tico-yellow drop-shadow-md" />
        <div className="w-3 h-1 bg-black/20 rounded-full mt-1 blur-[1px]"></div>
      </div>
    </div>
  );
}

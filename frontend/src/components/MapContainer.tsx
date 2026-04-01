import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { MapContainer as LeafletMap, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapContainerProps {
  origin?: [number, number];
  destination?: [number, number];
  routeCoords?: [number, number][];
  userLocation?: [number, number];
  driverLocation?: [number, number];
  onMapMoving?: (moving: boolean) => void;
}

const CHICLAYO_CENTER: [number, number] = [-6.7714, -79.8409];

const markerA = L.divIcon({
  className: '',
  html: '<div style="background:#1d4ed8;color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)">A</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const markerCar = L.divIcon({
  className: '',
  html: '<div style="background:#f59e0b;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)">🚕</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const markerB = L.divIcon({
  className: '',
  html: '<div style="background:#dc2626;color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)">B</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function MapMoveListener({ onMapMoving }: { onMapMoving: (moving: boolean) => void }) {
  const map = useMap();
  useEffect(() => {
    const onMoveStart = () => onMapMoving(true);
    const onMoveEnd = () => onMapMoving(false);
    map.on('movestart', onMoveStart);
    map.on('moveend', onMoveEnd);
    return () => {
      map.off('movestart', onMoveStart);
      map.off('moveend', onMoveEnd);
    };
  }, [map, onMapMoving]);
  return null;
}

function FitBounds({ origin, destination, routeCoords, userLocation }: { origin?: [number, number]; destination?: [number, number]; routeCoords?: [number, number][]; userLocation?: [number, number] }) {
  const map = useMap();
  const fitted = useRef(false);
  const centeredOnUser = useRef(false);

  useEffect(() => {
    if (routeCoords && routeCoords.length > 1) {
      const bounds = L.latLngBounds(routeCoords.map(c => L.latLng(c[0], c[1])));
      map.fitBounds(bounds, { padding: [60, 60] });
      fitted.current = true;
    } else if (origin && destination) {
      const bounds = L.latLngBounds([L.latLng(origin[0], origin[1]), L.latLng(destination[0], destination[1])]);
      map.fitBounds(bounds, { padding: [60, 60] });
      fitted.current = true;
    } else if (fitted.current) {
      map.setView(userLocation || CHICLAYO_CENTER, 15);
      fitted.current = false;
    }
  }, [origin, destination, routeCoords, map, userLocation]);

  useEffect(() => {
    if (userLocation && !fitted.current && !centeredOnUser.current) {
      map.setView(userLocation, 15);
      centeredOnUser.current = true;
    }
  }, [userLocation, map]);

  return null;
}

export default function MapContainer({ origin, destination, routeCoords, userLocation, driverLocation, onMapMoving }: MapContainerProps) {
  const center: [number, number] = userLocation || CHICLAYO_CENTER;
  const hasRoute = origin && destination;

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
        <FitBounds origin={origin} destination={destination} routeCoords={routeCoords} userLocation={userLocation} />
        {onMapMoving && <MapMoveListener onMapMoving={onMapMoving} />}
        {origin && <Marker position={origin} icon={markerA} />}
        {destination && <Marker position={destination} icon={markerB} />}
        {driverLocation && <Marker position={driverLocation} icon={markerCar} />}
        {routeCoords && routeCoords.length > 1 && (
          <Polyline positions={routeCoords} pathOptions={{ color: '#1d1d1d', weight: 5, opacity: 0.8 }} />
        )}
      </LeafletMap>

      {!hasRoute && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-[400]">
          <div className="bg-tico-black text-white text-xs font-bold px-3 py-1.5 rounded-full mb-1 shadow-lg">
            Tu ubicación
          </div>
          <MapPin className="w-10 h-10 text-tico-black fill-tico-green drop-shadow-md" />
          <div className="w-3 h-1 bg-black/20 rounded-full mt-1 blur-[1px]"></div>
        </div>
      )}
    </div>
  );
}

export async function fetchOSRMRoute(
  origin: [number, number],
  destination: [number, number]
): Promise<[number, number][]> {
  const url = `https://router.project-osrm.org/route/v1/driving/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.routes && data.routes.length > 0) {
    // GeoJSON coords are [lng, lat], convert to [lat, lng]
    return data.routes[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]] as [number, number]);
  }
  return [];
}

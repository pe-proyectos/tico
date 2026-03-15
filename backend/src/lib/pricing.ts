const BASE_FARE = Number(process.env.BASE_FARE) || 4; // S/4
const PER_KM = Number(process.env.PER_KM) || 1.5; // S/1.5 per km
const ROAD_FACTOR = Number(process.env.ROAD_FACTOR) || 1.3;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function estimatePrice(originLat: number, originLng: number, destLat: number, destLng: number) {
  const distance = haversineKm(originLat, originLng, destLat, destLng) * ROAD_FACTOR;
  const price = Math.round((BASE_FARE + PER_KM * distance) * 100) / 100;
  return { distance: Math.round(distance * 100) / 100, price };
}

export const PLAN_LIMITS: Record<string, number> = {
  FREE: Number(process.env.PLAN_LIMIT_FREE) || 20,
  PRO: Number(process.env.PLAN_LIMIT_PRO) || 100,
  BUSINESS: Number(process.env.PLAN_LIMIT_BUSINESS) || Infinity,
};

// In-memory driver location store

export interface DriverLocation {
  lat: number;
  lng: number;
  updatedAt: Date;
}

const driverLocations = new Map<string, DriverLocation>();

export function updateDriverLocation(userId: string, lat: number, lng: number) {
  driverLocations.set(userId, { lat, lng, updatedAt: new Date() });
}

export function getDriverLocation(userId: string): DriverLocation | undefined {
  return driverLocations.get(userId);
}

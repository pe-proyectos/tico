// In-memory pub/sub for real-time trip updates via WebSocket

const userConnections = new Map<string, any>();
const tripSubscriptions = new Map<string, Set<string>>(); // tripId -> Set<userId>

export function subscribe(userId: string, ws: any) {
  userConnections.set(userId, ws);
}

export function unsubscribe(userId: string) {
  userConnections.delete(userId);
  // Clean up trip subscriptions
  for (const [tripId, users] of tripSubscriptions) {
    users.delete(userId);
    if (users.size === 0) tripSubscriptions.delete(tripId);
  }
}

export function subscribeToTrip(tripId: string, userId: string) {
  if (!tripSubscriptions.has(tripId)) tripSubscriptions.set(tripId, new Set());
  tripSubscriptions.get(tripId)!.add(userId);
}

export function broadcastTripUpdate(tripId: string, tripData: any) {
  const users = tripSubscriptions.get(tripId);
  if (!users) return;
  const message = JSON.stringify({ type: "trip_update", tripId, trip: tripData });
  for (const userId of users) {
    const ws = userConnections.get(userId);
    if (ws) {
      try { ws.send(message); } catch {}
    }
  }
}

export function getUserWs(userId: string) {
  return userConnections.get(userId);
}

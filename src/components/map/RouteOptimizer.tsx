// components/RouteOptimizer.ts
import L from "leaflet";

export const optimizeRoute = (
  startLocation: L.LatLng,
  markers: { lat: number; lng: number; label: string; distance: number }[]
) => {
  const remaining = [...markers];
  const route = [];
  let currentLocation = startLocation;

  while (remaining.length > 0) {
    let nearestMarkerIndex = 0;
    let nearestDistance = currentLocation.distanceTo(
      L.latLng(remaining[0].lat, remaining[0].lng)
    );

    for (let i = 1; i < remaining.length; i++) {
      const distance = currentLocation.distanceTo(
        L.latLng(remaining[i].lat, remaining[i].lng)
      );
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestMarkerIndex = i;
      }
    }

    const nearestMarker = remaining.splice(nearestMarkerIndex, 1)[0];
    route.push(nearestMarker);
    currentLocation = L.latLng(nearestMarker.lat, nearestMarker.lng);
  }

  return route;
};

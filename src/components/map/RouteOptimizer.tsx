<<<<<<< HEAD
// Importa Leaflet para manejar la ubicación y las coordenadas.
import L from "leaflet";

// Exporta una función que optimiza una ruta dada una ubicación de inicio y marcadores.
export const optimizeRoute = (
  startLocation: L.LatLng, // Ubicación de inicio de la ruta.
  markers: { lat: number; lng: number; label: string; distance: number }[] // Lista de marcadores con sus coordenadas y etiquetas.
) => {
  // Crea una copia del arreglo de marcadores para poder modificarlos.
  const remaining = [...markers];
  // Inicializa un arreglo para almacenar la ruta optimizada.
  const route = [];
  // Establece la ubicación actual como la ubicación de inicio.
  let currentLocation = startLocation;

  // Mientras haya marcadores restantes por visitar.
  while (remaining.length > 0) {
    // Inicializa el índice del marcador más cercano y la distancia más cercana.
    let nearestMarkerIndex = 0;
    let nearestDistance = currentLocation.distanceTo(
      // Calcula la distancia al primer marcador.
      L.latLng(remaining[0].lat, remaining[0].lng)
    );

    // Itera sobre los marcadores restantes para encontrar el más cercano.
    for (let i = 1; i < remaining.length; i++) {
      // Calcula la distancia al marcador actual.
      const distance = currentLocation.distanceTo(
        L.latLng(remaining[i].lat, remaining[i].lng)
      );
      // Si la distancia es más corta que la más cercana encontrada hasta ahora.
      if (distance < nearestDistance) {
        // Actualiza la distancia más cercana y el índice del marcador más cercano.
=======
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
>>>>>>> origin
        nearestDistance = distance;
        nearestMarkerIndex = i;
      }
    }

<<<<<<< HEAD
    // Elimina el marcador más cercano del arreglo de marcadores restantes y lo almacena en la ruta.
    const nearestMarker = remaining.splice(nearestMarkerIndex, 1)[0];
    route.push(nearestMarker);
    // Actualiza la ubicación actual a la ubicación del marcador más cercano.
    currentLocation = L.latLng(nearestMarker.lat, nearestMarker.lng);
  }

  // Devuelve la ruta optimizada como un arreglo de marcadores.
=======
    const nearestMarker = remaining.splice(nearestMarkerIndex, 1)[0];
    route.push(nearestMarker);
    currentLocation = L.latLng(nearestMarker.lat, nearestMarker.lng);
  }

>>>>>>> origin
  return route;
};

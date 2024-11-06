import L from "leaflet";

const API_KEY = "5b3ce3597851110001cf624899fc548b5f4045d09133e855f8a2a9b9"; // Sustituye con tu clave de OpenRouteService
const ORS_URL = "https://api.openrouteservice.org/v2/directions/driving-car";

// Función para decodificar la geometría de la ruta
const decodePolyline = (polyline: string): [number, number][] => {
  const coordinates: [number, number][] = [];
  let index = 0,
    lat = 0,
    lng = 0;

  while (index < polyline.length) {
    let b,
      shift = 0,
      result = 0;

    // Decodificar latitud
    do {
      b = polyline.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result >> 1) ^ -(result & 1);
    lat += dlat;

    shift = 0;
    result = 0;

    // Decodificar longitud
    do {
      b = polyline.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result >> 1) ^ -(result & 1);
    lng += dlng;

    coordinates.push([lat / 1e5, lng / 1e5]); // Dividir por 1e5 para convertir a grados
  }

  return coordinates;
};

export const fetchRouteFromORS = async (
  start: L.LatLng,
  waypoints: { lat: number; lng: number; label: string }[]
): Promise<L.LatLng[]> => {
  const coordinates = [
    [start.lng, start.lat],
    ...waypoints.map((wp) => [wp.lng, wp.lat]),
  ];

  try {
    const response = await fetch(ORS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: API_KEY,
      },
      body: JSON.stringify({
        coordinates: coordinates,
        instructions: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error fetching route: ${errorData.message}`);
    }

    const data = await response.json();
    console.log("API Response:", data);
    if (data.routes.length > 0) {
      console.log("First Route:", data.routes[0]);
    }

    if (!data.routes || data.routes.length === 0 || !data.routes[0].geometry) {
      console.error("No valid route found or geometry is undefined.");
      return [];
    }

    // Decodificar la geometría de la ruta
    const decodedCoordinates = decodePolyline(data.routes[0].geometry);
    return decodedCoordinates.map(([lat, lng]) => L.latLng(lat, lng));
  } catch (error) {
    console.error("Error al obtener la ruta de OpenRouteService:", error);
    return [];
  }
};

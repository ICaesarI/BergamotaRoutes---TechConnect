"use client";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const ORS_URL = process.env.NEXT_PUBLIC_ORS_URL;

import L from "leaflet";

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

    const textResponse = await response.text();
    console.log("Raw API Response:", textResponse);

    if (!response.ok) {
      console.error(`HTTP Error: ${response.status}`);
      throw new Error(`HTTP ${response.status}: ${textResponse}`);
    }

    const data = JSON.parse(textResponse);
    console.log("Parsed API Response:", data);

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

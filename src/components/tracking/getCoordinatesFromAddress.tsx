import { useState, useEffect } from "react";

type Coordinates = { lat: number; lng: number } | null;

export const getCoordinatesFromAddress = async (
  address: string
): Promise<Coordinates> => {
  const apiKey = "5b3ce3597851110001cf624899fc548b5f4045d09133e855f8a2a9b9";
  const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(
    address
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const coordinates = data.features[0].geometry.coordinates;
      return { lat: coordinates[1], lng: coordinates[0] };
    } else {
      console.error(
        "No se encontraron coordenadas para la dirección proporcionada."
      );
      return null;
    }
  } catch (error) {
    console.error("Error al obtener las coordenadas:", error);
    return null;
  }
};

type GeocodeComponentProps = {
  address: string;
  onCoordinates: (coords: Coordinates) => void;
};

// components/GetLocation.js
"use client";

import { useState, useEffect } from "react";

const GetLocation = () => {
  const [position, setPosition] = useState([51.505, -0.09]); // Posición por defecto

  // Obtener la ubicación actual del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]); // Actualiza con las coordenadas actuales
        },
        (error) => {
          console.error("Error obteniendo la geolocalización: ", error);
        }
      );
    } else {
      console.error("El navegador no soporta geolocalización");
    }
  }, []);

  return position;
};

export default GetLocation;

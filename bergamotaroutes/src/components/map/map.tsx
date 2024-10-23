// components/MapComponent.js
"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import GetLocation from "./geoLocalitation";
import RecenterMap from "./recentMap";
import Markers from "./Markers";
import RoutingMachine from "./routingMachine";


const MapComponent = () => {
  const position = GetLocation(); // Usar el componente para obtener la posición actual

  // Posiciones de los otros marcadores
  const otherMarkers = [
    {
      position: [20.64208176688262, -103.31280142165164],
      popupText: "Marcador 2",
    },
    {
      position: [20.644469688842623, -103.30884619154352],
      popupText: "Marcador 3",
    },
    { position: [20.65507903101917, -103.32550073192527], popupText: "CUCEI" },
  ];

  // Actualizar iconos de Leaflet
  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  // Define los waypoints (coordenadas) para la ruta
  const waypoints = [
    position, // Punto de ubicación actual
    ...otherMarkers.map(marker => marker.position), // Agrega las posiciones de otros marcadores
  ];

  return (
    <MapContainer
      center={position} // Centro inicial
      zoom={10}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Componente que recentra el mapa */}
      <RecenterMap position={position} />

      {/* Componente para los marcadores */}
      <Markers position={position} otherMarkers={otherMarkers} />

      {/* Componente para la generación de rutas */}
      <RoutingMachine waypoints={waypoints} />
    </MapContainer>
  );
};

export default MapComponent;
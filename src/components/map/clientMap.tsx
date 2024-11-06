"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchRouteFromORS } from "./RouteService"; // Asegúrate de ajustar la ruta si es necesario

interface ClientMapProps {
  driverLocation: { lat: number; lng: number } | null;
  userLocation: { lat: number; lng: number } | null;
  showRoute: boolean;
}

const ClientMap: React.FC<ClientMapProps> = ({ driverLocation, userLocation, showRoute }) => {
  const [route, setRoute] = useState<L.LatLng[]>([]);

  useEffect(() => {
    const fetchRoute = async () => {
      if (driverLocation && userLocation) {
        const routeCoordinates = await fetchRouteFromORS(
          L.latLng(driverLocation.lat, driverLocation.lng),
          [{ lat: userLocation.lat, lng: userLocation.lng, label: "Cliente" }]
        );
        setRoute(routeCoordinates);
      }
    };

    if (showRoute) {
      fetchRoute();
    }
  }, [driverLocation, userLocation, showRoute]);

  return (
    <MapContainer center={driverLocation || [20.6512, -103.3196]} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {driverLocation && <Marker position={[driverLocation.lat, driverLocation.lng]} />}
      {userLocation && <Marker position={[userLocation.lat, userLocation.lng]} />}
      {showRoute && route.length > 0 && <Polyline positions={route} color="blue" />}
    </MapContainer>
  );
};

export default ClientMap;

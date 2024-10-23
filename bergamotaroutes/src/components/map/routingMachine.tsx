// components/RoutingMachine.js
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

const RoutingMachine = ({ waypoints }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Inicializa el control de enrutamiento
    const routingControl = L.Routing.control({
      waypoints: waypoints.map((point) => L.latLng(point[0], point[1])), // Mapeamos los puntos a latLng
      lineOptions: {
        styles: [{ color: "blue", weight: 2 }],
      },
      createMarker: (i, waypoint) => {
        return L.marker(waypoint.latLng, {
          icon: L.icon({
            iconUrl: "/ruta-a-tu-imagen.png", // Icono personalizado (opcional)
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          }),
        });
      },
      routeWhileDragging: true,
    }).addTo(map);

    // Limpiar el control de enrutamiento al desmontar
    return () => {
      map.removeControl(routingControl);
    };
  }, [map, waypoints]);

  return null;
};

export default RoutingMachine;

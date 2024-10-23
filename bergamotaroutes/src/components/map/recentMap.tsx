import { useEffect } from "react";
import { useMap } from "react-leaflet";

// Componente para actualizar el centro del mapa
const RecenterMap = ({ position }) => {
  const map = useMap(); // Obtiene la instancia del mapa
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom()); // Re-centra el mapa cuando cambie la posición
    }
  }, [position, map]);

  return null;
};

export default RecenterMap;
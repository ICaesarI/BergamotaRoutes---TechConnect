// Importa la biblioteca de React y el hook useEffect.
import React, { useEffect } from "react";
// Importa Leaflet para manejar la ubicación en el mapa.
import L from "leaflet";
// Importa el ícono de envío de Material UI.
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
// Importa ReactDOMServer para renderizar componentes React a una cadena HTML.
import ReactDOMServer from "react-dom/server";

// Define la interfaz para las props del componente OtherMarkers.
interface OtherMarkersProps {
  markers: { lat: number; lng: number; label: string }[]; // Prop para los marcadores, que incluye latitud, longitud y etiqueta.
  map: L.Map; // Prop para el mapa de Leaflet.
}

// Define el componente funcional OtherMarkers con sus props.
const OtherMarkers: React.FC<OtherMarkersProps> = ({ markers, map }) => {
  // useEffect se ejecuta al montar el componente o cuando cambian los marcadores o el mapa.
  useEffect(() => {
    // Verifica que el mapa esté disponible.
    if (map) {
      // Crea un ícono personalizado para los marcadores usando un componente de Material UI.
      const carIcon = L.divIcon({
        className: "custom-marker", // Clase CSS personalizada para el ícono.
        html: ReactDOMServer.renderToString(
          // Renderiza el ícono a una cadena HTML.
          <LocalShippingIcon style={{ fontSize: "30px", color: "green" }} />
        ),
        iconSize: [30, 30], // Tamaño del ícono en píxeles.
      });

      // Itera sobre cada marcador para añadirlo al mapa.
      markers.forEach(({ lat, lng, label }) => {
        // Verifica que las coordenadas sean válidas.
        if (lat !== undefined && lng !== undefined) {
          // Crea un marcador en la ubicación especificada y añade el ícono personalizado.
          L.marker([lat, lng], { icon: carIcon })
            .addTo(map) // Añade el marcador al mapa.
            .bindPopup(label); // Asocia un popup con el marcador que muestra la etiqueta.
        } else {
          // Muestra un aviso en la consola si las coordenadas son inválidas.
          console.warn("Marker has invalid coordinates:", { lat, lng, label });
        }
      });
    }
  }, [markers, map]); // Dependencias: se ejecuta cuando cambian markers o map.

  // Devuelve null ya que no se renderiza nada en el DOM.
  return null;
};

// Exporta el componente para ser utilizado en otras partes de la aplicación.
export default OtherMarkers;

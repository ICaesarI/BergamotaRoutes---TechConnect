<<<<<<< HEAD
// Importa la biblioteca de React y el hook useEffect.
import React, { useEffect } from "react";
// Importa Leaflet para manejar la ubicación en el mapa.
import L from "leaflet";
// Importa el ícono de cuenta de Material UI.
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// Importa ReactDOMServer para renderizar componentes React a una cadena HTML.
import ReactDOMServer from "react-dom/server";

// Define la interfaz para las props del componente LocationMarker.
interface LocationMarkerProps {
  userLocation: L.LatLng; // Prop para la ubicación del usuario.
  map: L.Map; // Prop para el mapa de Leaflet.
}

// Define el componente funcional LocationMarker con sus props.
=======
// components/LocationMarker.tsx
import React, { useEffect } from "react";
import L from "leaflet";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ReactDOMServer from "react-dom/server";

interface LocationMarkerProps {
  userLocation: L.LatLng;
  map: L.Map;
}

>>>>>>> origin
const LocationMarker: React.FC<LocationMarkerProps> = ({
  userLocation,
  map,
}) => {
<<<<<<< HEAD
  // useEffect se ejecuta al montar el componente o cuando cambian las props userLocation o map.
  useEffect(() => {
    // Verifica que la ubicación del usuario y el mapa estén disponibles.
    if (userLocation && map) {
      // Crea un ícono personalizado para el marcador usando un componente de Material UI.
      const userIcon = L.divIcon({
        className: "custom-marker", // Clase CSS personalizada para el ícono.
        html: ReactDOMServer.renderToString(
          // Renderiza el ícono a una cadena HTML.
          <AccountCircleIcon style={{ fontSize: "30px", color: "green" }} />
        ),
        iconSize: [30, 30], // Tamaño del ícono en píxeles.
      });

      // Crea un marcador en la ubicación del usuario y añade el ícono personalizado.
      L.marker(userLocation, { icon: userIcon })
        .addTo(map) // Añade el marcador al mapa.
        .bindPopup("Tu ubicación actual") // Asocia un popup con el marcador.
        .openPopup(); // Abre el popup al añadir el marcador.
    }
  }, [userLocation, map]); // Dependencias: se ejecuta cuando cambian userLocation o map.

  // Devuelve null ya que no se renderiza nada en el DOM.
  return null;
};

// Exporta el componente para ser utilizado en otras partes de la aplicación.
=======
  useEffect(() => {
    if (userLocation && map) {
      const userIcon = L.divIcon({
        className: "custom-marker",
        html: ReactDOMServer.renderToString(
          <AccountCircleIcon style={{ fontSize: "30px", color: "green" }} />
        ),
        iconSize: [30, 30],
      });

      L.marker(userLocation, { icon: userIcon })
        .addTo(map)
        .bindPopup("Tu ubicación actual")
        .openPopup();
    }
  }, [userLocation, map]);

  return null;
};

>>>>>>> origin
export default LocationMarker;

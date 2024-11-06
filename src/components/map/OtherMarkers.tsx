import React, { useEffect } from "react";
import L from "leaflet";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReactDOMServer from "react-dom/server";

interface OtherMarkersProps {
  markers: { lat: number; lng: number; label: string }[]; // Cambiado para reflejar la estructura de MarkerData
  map: L.Map | null; // Asegúrate de que sea nullable
}

const OtherMarkers: React.FC<OtherMarkersProps> = ({ markers, map }) => {
  useEffect(() => {
    if (map) {
      const carIcon = L.divIcon({
        className: "custom-marker",
        html: ReactDOMServer.renderToString(
          <LocalShippingIcon style={{ fontSize: "30px", color: "green" }} />
        ),
        iconSize: [30, 30],
      });

      if (Array.isArray(markers)) {
        markers.forEach(({ lat, lng, label }) => {
          if (lat !== undefined && lng !== undefined) {
            L.marker([lat, lng], { icon: carIcon }).addTo(map).bindPopup(label);
          } else {
            console.warn("Marker has invalid coordinates:", {
              lat,
              lng,
              label,
            });
          }
        });
      } else {
        console.error("Expected markers to be an array, got:", markers);
      }
    }
  }, [markers, map]);

  return null;
};

export default OtherMarkers;

import React, { useEffect } from "react";
import L from "leaflet";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReactDOMServer from "react-dom/server";

interface OtherMarkersProps {
  markers: { lat: number; lng: number; label: string }[];
  map: L.Map;
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

      markers.forEach(({ lat, lng, label }) => {
        if (lat !== undefined && lng !== undefined) {
          L.marker([lat, lng], { icon: carIcon }).addTo(map).bindPopup(label);
        } else {
          console.warn("Marker has invalid coordinates:", { lat, lng, label });
        }
      });
    }
  }, [markers, map]);

  return null;
};

export default OtherMarkers;

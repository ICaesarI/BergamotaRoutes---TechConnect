// components/LocationMarker.tsx
import React, { useEffect } from "react";
import L from "leaflet";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ReactDOMServer from "react-dom/server";

interface LocationMarkerProps {
  userLocation: L.LatLng;
  map: L.Map;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({
  userLocation,
  map,
}) => {
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

export default LocationMarker;

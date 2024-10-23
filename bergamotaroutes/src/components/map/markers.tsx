// components/Markers.js
"use client";

import { Marker, Popup } from "react-leaflet";

const Markers = ({ position, otherMarkers }) => {
  return (
    <>
      {/* Marcador en la posición actual */}
      <Marker position={position}>
        <Popup>¡Estás aquí!</Popup>
      </Marker>

      {/* Otros marcadores adicionales */}
      {otherMarkers.map((marker, index) => (
        <Marker key={index} position={marker.position}>
          <Popup>{marker.popupText}</Popup>
        </Marker>
      ))}
    </>
  );
};

export default Markers;

// app/map/page.tsx (o donde necesites el componente)
"use client";

import MapComponent from "@techconnect /src/components/map/Map"; // Asegúrate de que la ruta sea correcta

export default function Map() {
  return (
    <div className="min-h-screen h-screen">
      {/* Componente de Mapa */}
      <div className="h-full w-full">
        <MapComponent />
      </div>
    </div>
  );
}

// app/map/page.tsx (o donde necesites el componente)
"use client";

import MapComponent from "@techconnect /src/components/map/map"; // Asegúrate de que la ruta sea correcta

export default function Map() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center min-h-screen bg-gray-50 h-screen">
      {/* Sidebar de Configuración */}
      <div className="bg-green-bold flex flex-col justify-between h-full p-4">
        <h1 className="font-bold text-lg text-white">Configuración</h1>
        <div>
          <button className="shadow-lg bg-yellow-alert text-white font-bold py-2 px-4 rounded hover:bg-yellow-alert-hover">
            Reportar error de ruta
          </button>
        </div>
      </div>

      {/* Componente de Mapa */}
      <div className="h-full w-full col-span-2">
        <MapComponent />
      </div>
    </div>
  );
}

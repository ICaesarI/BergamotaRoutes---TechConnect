"use client";

import React, { useState } from "react";
import MapComponent from '@techconnect /src/components/map/clientMap'; // Asegúrate de que la ruta sea correcta
import { db } from "@techconnect /src/database/firebaseConfiguration"; // Asegúrate de que la ruta sea correcta
import { doc, getDoc } from 'firebase/firestore';

const PackageTracking = () => {
  const [trackingCode, setTrackingCode] = useState("");
  const [status, setStatus] = useState<{
    step: string;
    message: string;
    showRoute: boolean;
  } | null>(null);

  const handleTrack = async () => {
    if (!trackingCode) {
      alert("Por favor, ingresa un código de seguimiento.");
      return;
    }

    try {
      const docRef = doc(db, "packages", trackingCode); // Cambia "packages" por el nombre de tu colección
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const trackingStatus = docSnap.data();
        console.log(trackingStatus); // Imprimir para verificar los datos recibidos
        setStatus({
          step: trackingStatus.step || "Desconocido",
          message: trackingStatus.message || "Estado desconocido.",
          showRoute: trackingStatus.showRoute || false,
        });
      } else {
        alert("No se encontró un paquete con ese código de seguimiento.");
      }
    } catch (error) {
      console.error("Error al obtener el estado del paquete:", error);
      alert("Ocurrió un error al intentar obtener el estado del paquete.");
    }
  };

  return (
    <div className="my-10 mx-10 mb-10 mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Seguimiento de Pedido</h2>
      
      <div className="mb-4">
        <label htmlFor="trackingCode" className="block text-gray-600 font-medium">
          Ingresa tu código de seguimiento:
        </label>
        <input
          type="text"
          id="trackingCode"
          value={trackingCode}
          onChange={(e) => setTrackingCode(e.target.value)}
          className="w-full mt-2 p-2 border rounded-md"
          placeholder="Ejemplo: ABC123456"
        />
      </div>
      
      <button
        onClick={handleTrack}
        className="w-full bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600"
      >
        Buscar
      </button>

      {status && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-center mb-2">Estado del Pedido</h3>
          <div className="p-4 bg-gray-100 rounded-md">
            <p><strong>Estado:</strong> {status.step}</p>
            <p>{status.message}</p>
          </div>

          {status.showRoute ? (
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">Ruta del pedido:</h4>
              <MapComponent showRoute={status.showRoute} />
            </div>
          ) : (
            <div className="mt-4 text-center text-gray-600">
              El pedido aún no ha comenzado su ruta. Te avisaremos cuando esté en camino.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PackageTracking;

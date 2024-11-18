"use client";

import React, { useState } from "react";
import MapComponent from '@techconnect /src/components/map/dinamicMap';
import { db } from "@techconnect /src/database/firebaseConfiguration";
import { doc, getDoc } from 'firebase/firestore';

const PackageTracking = () => {
  const [trackingCode, setTrackingCode] = useState("");
  const [status, setStatus] = useState<{
    step: string;
    message: string;
    showRoute: boolean;
  } | null>(null);
  const [isCodeEntered, setIsCodeEntered] = useState(false); // Nuevo estado para controlar la visibilidad del formulario

  const handleTrack = async () => {
    if (!trackingCode) {
      alert("Por favor, ingresa un código de seguimiento.");
      return;
    }

    try {
      const docRef = doc(db, "paquetesPrueba", trackingCode);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const trackingStatus = docSnap.data();
        console.log(trackingStatus);
        setStatus({
          step: trackingStatus.step || "En proceso",
          message: trackingStatus.message || "Paquete en proceso de envio",
          showRoute: trackingStatus.showRoute || false,
        });
        setIsCodeEntered(true); // Ocultamos el formulario y mostramos el contenido después de ingresar el código
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
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold">Rastrear</h2>
        <h3 className="text-2xl text-gray-400 font-semibold">Ingresa el código del producto</h3>
      </div>

      {/* Mostrar el formulario solo si el código no ha sido ingresado */}
      {!isCodeEntered && (
        <div className="bg-white p-8">
          <div className="flex flex-col items-center">
            {/* Aquí podrías agregar un icono o imagen */}
          </div>
          <div className="mt-6 mx-16">
            <h1 className="text-2xl font-bold">Ingresa el código:</h1>
            <input
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              className="w-full p-2 rounded-lg border mt-2"
              placeholder="Escriba aquí su código..."
            />
            <button
              onClick={handleTrack}
              className="w-full bg-blue-500 text-white text-sm rounded-lg my-2 py-2 mt-4 hover:bg-blue-600"
            >
              Buscar
            </button>
          </div>
        </div>
      )}

      {/* Mostrar el estado y mapa del paquete cuando se ingresa el código */}
      {isCodeEntered && (
        <div className="bg-gray-100 p-4 flex flex-col justify-between rounded-lg shadow-inner">
          {status ? (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-center text-xl font-semibold">Estado del Pedido</h3>
              <p className="mt-4"><strong>Estado:</strong> {status.step}</p>
              <p>{status.message}</p>
              {status.showRoute ? (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-2">Ruta del pedido:</h4>
                  <MapComponent showRoute={status.showRoute} />
                </div>
              ) : (
                <div className="text-center text-gray-600 mt-4">
                  El pedido aún no ha comenzado su ruta.
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500">Introduce un código de seguimiento para ver el estado del paquete.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PackageTracking;

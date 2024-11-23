"use client";

import React, { useState } from "react";
import MapComponent from "@techconnect /src/components/map/clientMap";
import { db } from "@techconnect /src/database/firebaseConfiguration";
import { doc, getDoc } from "firebase/firestore";
import { error } from "console";
import Swal from "sweetalert2";

const PackageTracking = () => {
  const [trackingCode, setTrackingCode] = useState("");
  const [status, setStatus] = useState<{
    step: string;
    message: string;
    showRoute: boolean;
  } | null>(null);
  const [isCodeEntered, setIsCodeEntered] = useState(false);

  const handleTrack = async () => {
    if (!trackingCode) {
      Swal.fire({
        icon: "warning",
        title: "Código faltante",
        text: "Por favor, ingresa un código de seguimiento.",
        confirmButtonText: "Entendido",
      });
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
          message: trackingStatus.message || "Paquete en proceso de envío",
          showRoute: trackingStatus.showRoute || false,
        });
        setIsCodeEntered(true);
        Swal.fire({
          icon: "success",
          title: "¡Código encontrado!",
          text: "Hemos encontrado el paquete con el código proporcionado.",
          confirmButtonText: "Continuar",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "No encontrado",
          text: "No se encontró un paquete con ese código de seguimiento.",
          confirmButtonText: "Intentar de nuevo",
        });
      }
    } catch (error) {
      console.error("Error al obtener el estado del paquete:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al intentar obtener el estado del paquete. Por favor, inténtalo más tarde.",
        confirmButtonText: "Entendido",
      });
    }
  };

  return (
    <div className="min-h-screen items-center justify-center my-10 mx-10 mb-10 mt-10 p-6 bg-white shadow-lg rounded-lg">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold">Rastrear</h2>
        <h3 className="text-2xl text-gray-400 font-semibold">
          Ingresa el código del producto
        </h3>
      </div>

      {!isCodeEntered && (
        <div className="bg-white p-8">
          <div className="mt-6 mx-16">
            <h1 className="text-2xl font-bold">Ingresa el código:</h1>
            <input
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              className="w-full p-2 rounded-lg border-2 border-transparent mt-2 bg-gray-100 outline-none transition-all duration-500 hover:border-blue-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-300"
              placeholder="Escriba aquí su código..."
            />
            <button
              onClick={handleTrack}
              className="w-full bg-blue-500 text-white font-bold text-sm py-2 px-4 mt-2 rounded-md shadow-md transition-all duration-100 active:translate-y-1 active:shadow-none"
            >
              Buscar
            </button>
          </div>
        </div>
      )}

      {isCodeEntered && (
        <div className="bg-gray-100 p-4 flex flex-col justify-between rounded-lg shadow-inner">
          {status ? (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-center text-xl font-semibold">
                Estado del Pedido
              </h3>
              <p>ID rastreo: {trackingCode}</p>
              <p className="mt-4">
                <strong>Estado:</strong> {status.step}
              </p>
              <p>{status.message}</p>
              {status.showRoute ? (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-2">
                    Ruta del pedido:
                  </h4>
                  {status.showRoute && (
                    <MapComponent trackingCode={trackingCode} />
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-600 mt-4">
                  El pedido está {status.step}.
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Introduce un código de seguimiento para ver el estado del paquete.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PackageTracking;
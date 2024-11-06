"use client";

import Image from "next/image";
//import boxPackage from "@techconnect/src/img/boxPackage.svg";
//import qR from "@techconnect/src/img/qR.svg";
import React, { useState } from "react";
import MapComponent from "@techconnect /src/components/map/clientMap"; // Asegúrate de que la ruta sea correcta
import { db } from "@techconnect /src/database/firebaseConfiguration"; // Asegúrate de que la ruta sea correcta
import { doc, getDoc } from "firebase/firestore";

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
    <div className="main-container flex flex-col">
      {/* Div superior */}
      <div className="flex flex-col justify-center items-center bg-white">
        <h1 className="text-3xl font-bold">Routes</h1>
        <h1 className="text-4xl text-gray-400 font-bold">
          Scan or manually enter the product code
        </h1>
      </div>
      
      <div className="flex">
        {/* Primer div inferior */}
        <div className="w-1/2 bg-white p-16">
          <div className="p-4 bg-white flex justify-center items-center">
            {/* <Image src={qR} alt="QR" /> */}
            <h1 className="text-center text-3xl ml-2 font-bold">Scan</h1>
          </div>
          <div>
            <h1 className="text-2xl mt-6 mx-16 font-bold">Insert Code</h1>
            <input
              id="codeInput"
              placeholder="Escriba aquí su código..."
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              className="w-52 mx-16 p-2 rounded-lg"
            />
            <button
              onClick={handleTrack}
              className="w-52 mx-16 bg-black-main text-sm text-white rounded-lg my-1 py-1 px-2"
            >
              Insert
            </button>
          </div>
        </div>

        {/* Segundo div inferior */}
        <div className="w-1/2 bg-white p-4 flex flex-col">
          <div className="bg-black-main rounded-lg p-4 flex flex-col h-64">
            <h1 className="text-center text-white font-bold text-2xl">
              Package List
            </h1>
            <div className="flex flex-col bg-black-main h-64 w-128 mx-auto overflow-y-auto p-2">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center p-2 mt-2">
                  {/* <Image src={boxPackage} alt="Box Package" className="w-7 h-7" /> */}
                  <h3 className="ml-2 text-xs text-white text-center">
                    #1 Calle Gabriel Ramos Millan 25, Col Americana, Americana, 44160 Guadalajara, Jal. Total Kilometers 10.3KM ID PAQUETE #1123123 #5434634 #6585685
                  </h3>
                </div>
                {/* Agrega más items aquí según sea necesario */}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button className="mw-1/2 bg-black-main text-sm text-white rounded-lg my-1 py-1 px-2">
              Go to Drive
            </button>
          </div>
        </div>
      </div>

      {status && (
        <div className="my-10 mx-10 mb-10 mt-10 p-6 bg-white shadow-lg rounded-lg">
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

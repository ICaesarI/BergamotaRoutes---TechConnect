"use client";

import Image from "next/image";
import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@techconnect /src/database/firebaseConfiguration";
import RoadImage from "@techconnect /src/img/roadImage.webp";
import TruckImage from "@techconnect /src/img/truckImage.png";
import PackageIcon from "@techconnect /src/img/packageIcon.svg";
import InputField from "@techconnect /src/components/inputField";
import { Card } from "@techconnect /src/components/card";
import MapComponent from "@techconnect /src/components/map/dinamicMap";
import Link from "next/link";

export default function Tracking() {
  const [routeCode, setRouteCode] = useState("");
  const [trackingData, setTrackingData] = useState<any[]>([]);
  const [error, setError] = useState<{ coordinate?: string }>({});

  const fetchTrackingData = async (routeCode: string) => {
    try {
      const docRef = doc(db, "tracking", routeCode);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const dataCollection: any[] = [];

        for (let i = 1; i <= 10; i++) {
          const item = data[i];
          if (item) {
            const { address, location, number, status } = item;
            dataCollection.push({
              address: address || "No address provided",
              location: location || {
                _lat: "No latitude",
                _long: "No longitude",
              },
              number: number || "No number provided",
              status: status !== undefined ? status : "No status provided",
            });
          }
        }

        if (dataCollection.length > 0) {
          setTrackingData(dataCollection);
          setError({});
        } else {
          setError({ coordinate: "No se encontraron datos para este UID." });
        }
      } else {
        setError({ coordinate: "No se encontró el documento para este UID." });
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setError({ coordinate: "Error al obtener los datos de Firestore." });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 p-5">
      <div>
        <div className="relative w-full h-[200px] rounded overflow-hidden m-3">
          <Image
            src={RoadImage}
            alt="Road Image"
            layout="fill"
            className="object-cover"
          />
          <div className="absolute inset-0 flex justify-center items-center text-white font-bold text-center before:absolute before:inset-0 before:bg-green-bold before:bg-opacity-50 p-5">
            <h1 className="relative z-10 mb-4 text-3xl">
              Welcome to route tracking. Enter your route code and watch every
              move.
            </h1>
            <Image
              src={TruckImage}
              alt="Truck Image"
              width={200}
              height={200}
              className="relative z-10 opacity-100"
            />
          </div>
        </div>
        <div className="m-3 flex flex-col justify-between">
          <InputField
            label="Enter route code"
            placeholder="e.g. XtDAkCIWcvLpetIkTEWn"
            value={routeCode}
            onChange={setRouteCode}
            backgroundInput="bg-white"
            textColor="black"
            icon={PackageIcon}
          />
          <button
            onClick={() => fetchTrackingData(routeCode)}
            className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Agregar Ruta
          </button>
          {error.coordinate && (
            <p className="text-red-500 text-sm">{error.coordinate}</p>
          )}
        </div>

        {trackingData.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-700 mb-3">
              Información de la Ruta:
            </h2>
            <ul className="list-disc pl-5">
              {trackingData.map((data, index) => (
                <li key={index} className="text-gray-600 mb-2">
                  <strong>Dirección:</strong> {data.address} <br />
                  <strong>Ubicación:</strong> {data.location._lat}° N,{" "}
                  {data.location._long}° W <br />
                  <strong>Número:</strong> {data.number} <br />
                  <strong>Estado:</strong> {data.status ? "Activo" : "Inactivo"}{" "}
                  <br />
                </li>
              ))}
            </ul>
            {/* Botón para redirigir a /map con los puntos de la ruta */}
            <div className="mt-4 flex justify-center">
              <Link
                href={{
                  pathname: "/map",
                  query: {
                    route: encodeURIComponent(JSON.stringify(routeCode)), // Enviar los datos de la ruta
                  },
                }}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                Ver Mapa Completo
              </Link>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center items-center ml-32">
        {trackingData.length > 0 ? (
          <MapComponent routeCode={routeCode} /> // Mostrar mapa cuando hay datos
        ) : (
          <Card /> // Mostrar Card cuando no hay datos
        )}
      </div>
    </div>
  );
}

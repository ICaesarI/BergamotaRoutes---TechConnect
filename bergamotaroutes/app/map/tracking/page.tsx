"use client";

import Image from "next/image";
import RoadImage from "@techconnect /src/img/roadImage.webp";
import TruckImage from "@techconnect /src/img/truckImage.png";
import PackageIcon from "@techconnect /src/img/packageIcon.svg";

import InputField from "@techconnect /src/components/inputField";
import { useState } from "react";
import { validateCoordinates } from "@techconnect /src/security/validateCoordinates";

import MapComponent from "@techconnect /src/components/map/dinamicMap";

export default function Tracking() {
  const [latitude, setLatitude] = useState(""); // Estado para la latitud
  const [longitude, setLongitude] = useState(""); // Estado para la longitud
  const [tracking, setTracking] = useState<string[]>([]); // Arreglo de coordenadas
  const [error, setError] = useState<{ coordinate?: string }>({}); // Inicializa como objeto vacío

  const handleDeletePackage = (index: number) => {
    const deletePackage = tracking.filter((_, i) => i !== index);
    setTracking(deletePackage);
  };

  const handleAddTracking = () => {
    const newCoordinate = `${latitude}, ${longitude}`; // Combina latitud y longitud
    const newError: { coordinate?: string } = {}; // Definición del objeto de error

    // Verifica si la nueva coordenada es válida
    if (!validateCoordinates(newCoordinate)) {
      newError.coordinate = "The coordinate is incorrect"; // Mensaje de error
    }

    if (Object.keys(newError).length > 0) {
      setError(newError); // Establece el error si hay uno
      return;
    }

    setError({}); // Limpia el error si no hay errores

    setTracking((prevTracking) => [...prevTracking, newCoordinate]); // Agrega la nueva coordenada
    setLatitude(""); // Limpia el input de latitud
    setLongitude(""); // Limpia el input de longitud
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3">
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
              Welcome to route tracking. Enter your destination and watch every
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
        <div className="m-3 flex flex-col items-center justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2">
            <InputField
              label="Enter Latitude"
              placeholder="e.g. 123.456"
              value={latitude}
              onChange={setLatitude} // Actualiza el estado de latitud
              backgroundInput="bg-white"
              textColor="black"
              icon={PackageIcon}
            />
            <InputField
              label="Enter Longitude"
              placeholder="e.g. -78.901"
              value={longitude}
              onChange={setLongitude} // Actualiza el estado de longitud
              backgroundInput="bg-white"
              textColor="black"
              icon={PackageIcon}
            />
          </div>
          <button
            className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddTracking} // Agrega la nueva coordenada
          >
            Agregar Ruta
          </button>
          {error.coordinate && (
            <p className="text-red-500 text-sm">{error.coordinate}</p>
          )}
        </div>
        <div>
          {tracking.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-bold text-gray-700 mb-3">
                Rutas añadidas:
              </h2>
              <div className="space-y-3">
                {tracking.map((coord, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow"
                  >
                    <div className="flex items-center">
                      <Image
                        src={PackageIcon}
                        alt="User icon"
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                      <p className="text-gray-700">{coord}</p>
                    </div>
                    <button
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-700"
                      onClick={() => handleDeletePackage(index)}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Componente del mapa que recibe las coordenadas de seguimiento */}
      <div className="w-full h-[500px] md:h-screen m-3">
        <MapComponent
          otherMarkersData={tracking} // Pasa las coordenadas como marcadores
        />
      </div>
    </div>
  );
}

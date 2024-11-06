"use client";

import { useState } from "react";
import { getCoordinatesFromAddress } from "@techconnect /src/components/tracking/getCoordinatesFromAddress";

type Coordinates = { lat: number; lng: number } | null;

export default function GetAddress() {
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [coordinates, setCoordinates] = useState<Coordinates>(null);
  const [loading, setLoading] = useState(false);

  const handleGetCoordinates = async () => {
    setLoading(true);
    const address = `${street} ${number}, ${city}, ${state} ${zipCode}`;
    const coords = await getCoordinatesFromAddress(address);
    setCoordinates(coords);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Obtener Coordenadas
        </h1>
        <input
          type="text"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          placeholder="Nombre de la calle"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-4"
        />
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Número"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-4"
        />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ciudad"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-4"
        />
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="Estado"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-4"
        />
        <input
          type="text"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          placeholder="Código Postal"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-4"
        />
        <button
          onClick={handleGetCoordinates}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md mt-4 transition duration-300"
        >
          {loading ? "Buscando..." : "Obtener Coordenadas"}
        </button>
        <div className="mt-6">
          {coordinates ? (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700">
                Coordenadas encontradas:
              </h2>
              <p className="text-gray-600 mt-2">Latitud: {coordinates.lat}</p>
              <p className="text-gray-600">Longitud: {coordinates.lng}</p>
            </div>
          ) : (
            !loading && (
              <p className="text-gray-500 text-center">
                Ingresa los datos de dirección para ver las coordenadas.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

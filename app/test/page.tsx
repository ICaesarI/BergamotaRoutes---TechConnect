"use client";

import { useState } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  setDoc,
  GeoPoint,
} from "firebase/firestore";
import { db } from "@techconnect /src/database/firebaseConfiguration";
import { getCoordinatesFromAddress } from "@techconnect /src/components/tracking/getCoordinatesFromAddress";

const CrearPaquete = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [peso, setPeso] = useState("");
  const [estado, setEstado] = useState("");
  const [pais, setPais] = useState("");
  const [estadoDireccion, setEstadoDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [colonia, setColonia] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [calle, setCalle] = useState("");
  const [numeroCalle, setNumeroCalle] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [number, setNumber] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullAddress = `${calle} ${numeroCalle}, ${colonia}, ${ciudad}, ${estadoDireccion}, ${pais}, ${codigoPostal}`;

    try {
      const coordinates = await getCoordinatesFromAddress(fullAddress);
      if (coordinates) {
        setLocation(coordinates);

        const docRef = await addDoc(collection(db, "paquetesPrueba"), {
          nombre,
          descripcion,
          peso,
          estado,
          createdAt: new Date(),
          ciudad,
          estadoDireccion,
          pais,
          colonia,
          codigoPostal,
          calle,
          numeroCalle,
        });

        const paqueteId = docRef.id;

        await updateDoc(doc(db, "paquetesPrueba", paqueteId), {
          uid: paqueteId,
          status: `/pauquetesPrueba/${paqueteId}`,
        });

        // Cambié "package" por "packages" y no uso paqueteId como ID de documento
        await setDoc(
          doc(db, `tracking/XXVxhxoKcqfmX3vEHg8u/packages/${paqueteId}`),
          {
            address: fullAddress,
            location: new GeoPoint(coordinates.lat, coordinates.lng),
            statusDriver: "En espera",
            uidPackage: paqueteId,
          }
        );

        console.log("Paquete creado y agregado a tracking con ID:", paqueteId);

        // Resetear valores
        setNombre("");
        setDescripcion("");
        setPeso("");
        setEstado("");
        setPais("");
        setEstadoDireccion("");
        setCiudad("");
        setColonia("");
        setCodigoPostal("");
        setCalle("");
        setNumeroCalle("");
        setLocation(null);
        setNumber("");
      } else {
        console.error(
          "No se pudieron obtener las coordenadas de la dirección."
        );
      }
    } catch (e) {
      console.error("Error al agregar el paquete: ", e);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Crear Paquete</h2>
      <form onSubmit={handleSubmit}>
        {/* Campos adicionales */}
        <div className="mb-4">
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre del Paquete
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="descripcion"
            className="block text-sm font-medium text-gray-700"
          >
            Descripción
          </label>
          <input
            id="descripcion"
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="peso"
            className="block text-sm font-medium text-gray-700"
          >
            Peso
          </label>
          <input
            id="peso"
            type="text"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="colonia"
            className="block text-sm font-medium text-gray-700"
          >
            Colonia
          </label>
          <input
            id="colonia"
            type="text"
            value={colonia}
            onChange={(e) => setColonia(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="pais"
            className="block text-sm font-medium text-gray-700"
          >
            País
          </label>
          <input
            id="pais"
            type="text"
            value={pais}
            onChange={(e) => setPais(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="estadoDireccion"
            className="block text-sm font-medium text-gray-700"
          >
            Estado
          </label>
          <input
            id="estadoDireccion"
            type="text"
            value={estadoDireccion}
            onChange={(e) => setEstadoDireccion(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="ciudad"
            className="block text-sm font-medium text-gray-700"
          >
            Ciudad
          </label>
          <input
            id="ciudad"
            type="text"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="codigoPostal"
            className="block text-sm font-medium text-gray-700"
          >
            Código Postal
          </label>
          <input
            id="codigoPostal"
            type="text"
            value={codigoPostal}
            onChange={(e) => setCodigoPostal(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="calle"
            className="block text-sm font-medium text-gray-700"
          >
            Calle
          </label>
          <input
            id="calle"
            type="text"
            value={calle}
            onChange={(e) => setCalle(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="numeroCalle"
            className="block text-sm font-medium text-gray-700"
          >
            Número de Calle
          </label>
          <input
            id="numeroCalle"
            type="text"
            value={numeroCalle}
            onChange={(e) => setNumeroCalle(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Crear Paquete
        </button>
      </form>
    </div>
  );
};

export default CrearPaquete;

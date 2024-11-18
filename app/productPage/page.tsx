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
  const [pais, setPais] = useState("");
  const [estadoDireccion, setEstadoDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [colonia, setColonia] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [calle, setCalle] = useState("");
  const [numeroCalle, setNumeroCalle] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [number, setNumber] = useState("");
  const [showRoute, setShowRoute] = useState(false);
  const [step, setStep] = useState("Pendiente");
  const [message, setMessage] = useState("");

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
          createdAt: new Date(),
          ciudad,
          estadoDireccion,
          pais,
          colonia,
          codigoPostal,
          calle,
          numeroCalle,
          showRoute,
          step,
          message,
        });

        const paqueteId = docRef.id;

        await updateDoc(doc(db, "paquetesPrueba", paqueteId), {
          uid: paqueteId,
          status: `/pauquetesPrueba/${paqueteId}`,
        });

        await setDoc(
          doc(db, `tracking/64OGdO4ukuB89f6TWHpl/packages/${paqueteId}`),
          {
            address: fullAddress,
            location: new GeoPoint(coordinates.lat, coordinates.lng),
            statusDriver: "En espera",
            uidPackage: paqueteId,
          }
        );

        console.log("Paquete creado y agregado a tracking con ID:", paqueteId);
        setNombre("");
        setDescripcion("");
        setPeso("");
        setPais("");
        setEstadoDireccion("");
        setCiudad("");
        setColonia("");
        setCodigoPostal("");
        setCalle("");
        setNumeroCalle("");
        setLocation(null);
        setNumber("");
        setShowRoute(false);
        setStep("Pendiente");
        setMessage("El paquete aún no ha comenzado su ruta");
      } else {
        console.error("No se pudieron obtener las coordenadas de la dirección.");
      }
    } catch (e) {
      console.error("Error al agregar el paquete: ", e);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sección izquierda con recuadro del producto */}
      <div className="flex-1 flex items-center justify-center bg-gray-200 p-4">
        <div className="w-1/2 h-1/2 border border-gray-500 rounded-lg flex items-center justify-center p-2">
          <p className="text-gray-600 text-center text-sm">Imagen del Producto</p>
        </div>
      </div>

      {/* Sección derecha con formulario de compra */}
      <div className="flex-1 bg-white p-4 flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-2 text-center">Formulario de Ejemplo de Compra</h2>
        <p className="text-xs text-gray-600 mb-4 text-center">
          Completa los datos del pedido para pasarlo a la base de datos.
        </p>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label htmlFor="nombre" className="text-center block text-xs font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded w-full text-sm text-center"
            />
          </div>

          <div>
            <label htmlFor="descripcion" className="text-center block text-xs font-medium text-gray-700">
              Descripción
            </label>
            <input
              type="text"
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded w-full text-sm text-center"
            />
          </div>

          <div>
            <label htmlFor="peso" className="text-center block text-xs font-medium text-gray-700">
              Peso
            </label>
            <input
              type="text"
              id="peso"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded w-full text-sm text-center"
            />
          </div>

          <div>
            <label htmlFor="direccion" className="text-center block text-xs font-medium text-gray-700">
            Dirección
            </label>
            <input
              type="text"
              id="direccion"
              value={calle}
              onChange={(e) => setCalle(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded w-full text-sm text-center"
            />
          </div>

          <div className="flex space-x-2">
            <div className="w-1/2">
              <label htmlFor="colonia" className="text-center block text-xs font-medium text-gray-700">
                Colonia
              </label>
              <input
                type="text"
                id="colonia"
                value={colonia}
                onChange={(e) => setColonia(e.target.value)}
                required
                className="p-2 border border-gray-300 rounded w-full text-sm text-center"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="number" className="text-center block text-xs font-medium text-gray-700">
                Número de Calle
              </label>
              <input
                type="number"
                id="numeroCalle"
                value={numeroCalle}
                onChange={(e) => setNumeroCalle(e.target.value)}
                required
                className="p-2 border border-gray-300 rounded w-full text-sm text-center"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <div className="w-1/2">
              <label htmlFor="estado" className="text-center block text-xs font-medium text-gray-700">
                Estado
              </label>
              <input
                type="text"
                id="estadoDireccion"
                value={estadoDireccion}
                onChange={(e) => setEstadoDireccion(e.target.value)}
                required
                className="p-2 border border-gray-300 rounded w-full text-sm text-center"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="pais" className="text-center block text-xs font-medium text-gray-700">
                País
              </label>
              <input
                type="text"
                id="pais"
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                required
                className="p-2 border border-gray-300 rounded w-full text-sm text-center"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <div className="w-1/2">
              <label htmlFor="ciudad" className="text-center block text-xs font-medium text-gray-700">
                Ciudad
              </label>
              <input
                type="text"
                id="ciudad"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                required
                className="p-2 border border-gray-300 rounded w-full text-sm text-center"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="codigoPostal" className="text-center block text-xs font-medium text-gray-700">
                Código Postal
              </label>
              <input
                type="text"
                id="codigoPostal"
                value={codigoPostal}
                onChange={(e) => setCodigoPostal(e.target.value)}
                required
                className="p-2 border border-gray-300 rounded w-full text-sm text-center"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded hover:bg-gray-700 transition-colors duration-300 font-semibold text-sm text-center"
          >
            Realizar Compra
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearPaquete;

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
import Swal from "sweetalert2"; // Importa SweetAlert

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
      // Muestra alerta de que se están obteniendo las coordenadas
      Swal.fire({
        title: "Procesando...",
        text: "Obteniendo coordenadas de la dirección...",
        icon: "info",
        showConfirmButton: false,
        allowOutsideClick: false,
        willOpen: () => {
          Swal.showLoading(); // Muestra el loading spinner
        },
      });

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
          doc(db, `tracking/9V2pmqZC2zNqxjRBuHOO/packages/${paqueteId}`),
          {
            address: fullAddress,
            location: new GeoPoint(coordinates.lat, coordinates.lng),
            statusDriver: "En espera",
            uidPackage: paqueteId,
          }
        );

        console.log("Paquete creado y agregado a tracking con ID:", paqueteId);
        
        // Muestra alerta de éxito
        Swal.fire({
          title: "¡Éxito!",
          text: "El paquete fue creado correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });

        // Resetear campos
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
        // Muestra alerta de error si no se pudieron obtener las coordenadas
        Swal.fire({
          title: "Error",
          text: "No se pudieron obtener las coordenadas de la dirección.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (e) {
      // Muestra alerta de error general
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al agregar el paquete.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      console.error("Error al agregar el paquete: ", e);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left section with product box */}
      <div className="flex-1 flex items-center justify-center bg-gray-200 p-4">
        <div className="w-1/2 h-1/2 border border-gray-500 rounded-lg flex items-center justify-center p-2">
          <p className="text-gray-600 text-center text-sm">Product Image</p>
        </div>
      </div>

      {/* Right section with purchase form */}
      <div className="flex-1 bg-white p-4 flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-2 text-center">
          Sample Purchase Form
        </h2>
        <p className="text-xs text-gray-600 mb-4 text-center">
          Fill in the order details to save them in the database.
        </p>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label
              htmlFor="nombre"
              className="text-center block text-xs font-medium text-gray-700"
            >
              Name
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
            <label
              htmlFor="descripcion"
              className="text-center block text-xs font-medium text-gray-700"
            >
              Description
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
            <label
              htmlFor="peso"
              className="text-center block text-xs font-medium text-gray-700"
            >
              Weight
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
            <label
              htmlFor="direccion"
              className="text-center block text-xs font-medium text-gray-700"
            >
              Address
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
              <label
                htmlFor="colonia"
                className="text-center block text-xs font-medium text-gray-700"
              >
                Neighborhood
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
              <label
                htmlFor="number"
                className="text-center block text-xs font-medium text-gray-700"
              >
                Street Number
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
              <label
                htmlFor="estado"
                className="text-center block text-xs font-medium text-gray-700"
              >
                State
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
              <label
                htmlFor="pais"
                className="text-center block text-xs font-medium text-gray-700"
              >
                Country
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

          <button
            type="submit"
            className="mt-4 py-2 px-4 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Create Package
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearPaquete;

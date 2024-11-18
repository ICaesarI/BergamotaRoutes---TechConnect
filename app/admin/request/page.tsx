"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "@techconnect /src/database/firebaseConfiguration";
import { deleteUser } from "firebase/auth";

interface RequestData {
  uid: string;
  name: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  profileImage: string;
}

const RequestsList: React.FC = () => {
  const [requests, setRequests] = useState<RequestData[]>([]);

  // Obtener los documentos de la colección "request"
  useEffect(() => {
    const fetchRequests = async () => {
      const querySnapshot = await getDocs(collection(db, "request"));
      const requestData: RequestData[] = querySnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as RequestData[];
      setRequests(requestData);
    };
    fetchRequests();
  }, []);

  // Función para eliminar un documento de la colección y el usuario de Firebase Auth
  const handleReject = async (uid: string) => {
    try {
      // Eliminar de la colección "request"
      await deleteDoc(doc(db, "request", uid));
      setRequests(requests.filter((request) => request.uid !== uid));

      // Eliminar usuario de Firebase Auth
      const user = await auth.getUser(uid); // Si tienes los permisos
      if (user) await deleteUser(user);
      alert("Usuario rechazado correctamente.");
    } catch (error) {
      console.error("Error al rechazar el usuario:", error);
      alert("No se pudo rechazar al usuario. Revisa los permisos.");
    }
  };

  // Función para aceptar un usuario (mover de "request" a "drivers")
  const handleAccept = async (uid: string) => {
    try {
      // Buscar el usuario en el estado local
      const request = requests.find((request) => request.uid === uid);
      if (!request) {
        alert("No se encontró el usuario.");
        return;
      }

      // Crear un nuevo documento en la colección "drivers"
      await setDoc(doc(db, "drivers", uid), {
        name: request.name,
        lastname: request.lastname,
        email: request.email,
        phoneNumber: request.phoneNumber,
        profileImage: request.profileImage,
        createdAt: new Date(),
      });

      // Eliminar el documento de "request"
      await deleteDoc(doc(db, "request", uid));
      setRequests(requests.filter((request) => request.uid !== uid));

      alert(`Usuario con UID ${uid} aceptado y movido a 'drivers'.`);
    } catch (error) {
      console.error("Error al aceptar el usuario:", error);
      alert("No se pudo aceptar al usuario.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-3">
      {requests.map((request) => (
        <div
          key={request.uid}
          className="relative max-w-sm rounded-lg shadow-lg bg-white text-left overflow-hidden"
        >
          <img
            src={request.profileImage}
            alt={`${request.name} ${request.lastname}`}
            className="w-full h-48 object-cover"
          />
          <div className="p-5">
            <h3 className="text-xl font-semibold text-gray-800">
              {request.name} {request.lastname}
            </h3>
            <p className="text-gray-600">
              <strong>Correo:</strong> {request.email}
            </p>
            <p className="text-gray-600">
              <strong>Teléfono:</strong> {request.phoneNumber}
            </p>
          </div>
          <div className="flex justify-between px-5 pb-5">
            <button
              className="py-2 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700"
              onClick={() => handleAccept(request.uid)}
            >
              Aceptar
            </button>
            <button
              className="py-2 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700"
              onClick={() => handleReject(request.uid)}
            >
              Rechazar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequestsList;

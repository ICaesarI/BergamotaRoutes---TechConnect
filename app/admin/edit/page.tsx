"use client";

import { useState, useEffect } from "react";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "@techconnect /src/database/firebaseConfiguration";
import adminIcon from "@techconnect /src/img/adminIcon.png";
import Image from "next/image";

export default function EditAdmin() {
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [adminUid, setAdminUid] = useState(null);
  const [showPhotoInput, setShowPhotoInput] = useState(false); // Estado para mostrar el input de foto
  const [hoverText, setHoverText] = useState(false); // Estado para mostrar el texto en hover

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAdminUid(user.uid);
      } else {
        console.log("No hay ningún admin logueado");
        setAdminUid(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!adminUid) return;

    const fetchAdminData = async () => {
      try {
        const adminRef = doc(db, "admin", adminUid);
        const docSnap = await getDoc(adminRef);

        if (docSnap.exists()) {
          const adminData = docSnap.data();
          setPhotoURL(adminData.photoURL || "");
          setEmail(adminData.email || "");
          setPhoneNumber(adminData.phoneNumber || "");
        } else {
          console.log("No se encontró el documento del admin.");
        }
      } catch (error) {
        console.error("Error al obtener los datos del admin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [adminUid]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!adminUid) {
      alert("No estás logueado como admin");
      return;
    }

    const adminRef = doc(db, "admin", adminUid);

    try {
      await updateDoc(adminRef, {
        photoURL: photoURL,
        email: email,
        phoneNumber: phoneNumber,
        updatedAt: new Date().toISOString(),
      });

      alert("¡Datos actualizados correctamente!");
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      alert("Hubo un problema al guardar los cambios.");
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result);
        setShowPhotoInput(false); // Ocultar el input después de seleccionar la foto
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoClick = () => {
    setShowPhotoInput(true); // Mostrar el input de foto al hacer clic
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-center mb-6">Editar Perfil</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="photo"
            className="block text-sm font-medium text-gray-700"
          >
            Foto de perfil
          </label>

          <div
            className="mt-2 flex justify-center relative"
            onMouseEnter={() => setHoverText(true)} // Mostrar texto al pasar el mouse
            onMouseLeave={() => setHoverText(false)} // Ocultar texto al quitar el mouse
          >
            {/* Foto de perfil o ícono si no tiene foto */}
            {photoURL ? (
              <Image
                src={photoURL}
                alt="Vista previa de la foto de perfil"
                className="w-24 h-24 rounded-full object-cover cursor-pointer"
                onClick={handlePhotoClick} // Mostrar el input al hacer clic
              />
            ) : (
              <Image
                src={adminIcon}
                alt="Ícono de administrador"
                className="w-24 h-24 rounded-full object-cover cursor-pointer"
                onClick={handlePhotoClick} // Mostrar el input al hacer clic
              />
            )}

            {/* Hover Text */}
            {hoverText && !photoURL && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-60 p-2 rounded-md text-xs">
                Haz clic para actualizar la foto
              </div>
            )}
          </div>

          {/* Input de foto cuando se hace clic en la imagen */}
          {showPhotoInput && (
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
            />
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Número de Teléfono
          </label>
          <input
            type="tel"
            id="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
            required
          />
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}

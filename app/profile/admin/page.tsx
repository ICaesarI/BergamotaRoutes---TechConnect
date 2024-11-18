"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@techconnect /src/database/firebaseConfiguration";

const AdminProfile = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      console.log(currentUser);
      if (!currentUser) {
        router.push("/"); // Redirige a login si no hay usuario logueado
        return;
      }

      try {
        const userDocRef = doc(db, "admin", currentUser.uid); // Ajusta la ruta según tu estructura
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
        } else {
          console.error("No se encontró el usuario.");
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login"); // Redirige a la página de inicio de sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user || user.role !== "admin") {
    return <p>No tienes acceso a este perfil.</p>;
  }

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-bold text-center text-gray-800">
          Perfil de Administrador
        </h1>
        <div className="mt-4">
          <p className="text-gray-600">
            <span className="font-medium">Nombre:</span> {user.name}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Correo:</span> {user.email}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">UID:</span> {user.uid}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Fecha de creación:</span>{" "}
            {new Date(user.createdAt).toLocaleString()}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Rol:</span> {user.role}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;

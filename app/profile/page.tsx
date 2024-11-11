"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@techconnect /src/database/firebaseConfiguration";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation"; // Asegúrate de importar useRouter

interface Driver {
  name: string;
  lastname: string;
  email: string;
  birthday: string;
  phoneNumber: string;
  selectedGender: string;
  uid: string;
}

export default function Profile() {
  const [user, setUser] = useState<firebase.User | null>(null); // Estado para almacenar el usuario autenticado
  const [driverData, setDriverData] = useState<Driver | null>(null); // Estado para almacenar los datos del conductor
  const [loading, setLoading] = useState<boolean>(true); // Estado para manejar el estado de carga
  const router = useRouter(); // Instancia de useRouter para redirigir después de cerrar sesión

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Establecer el usuario autenticado
        const docRef = doc(db, "drivers", currentUser.uid); // Acceder a la colección 'drivers' con el UID
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDriverData(docSnap.data() as Driver); // Establecer los datos del conductor en el estado
        } else {
          console.log("No se encontraron datos del conductor.");
        }
      } else {
        setUser(null);
      }
      setLoading(false); // Terminar la carga
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Cerrar sesión
      router.push("/"); // Redirigir al usuario a la página de inicio de sesión
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Cargando...</div>;
  }

  if (!user) {
    return (
      <div className="text-center p-8 text-red-600">No has iniciado sesión</div>
    );
  }

  if (!driverData) {
    return (
      <div className="text-center p-8 text-red-600">
        No se encontraron datos del conductor.
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-10">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 space-y-6">
        <div className="flex flex-col items-center">
          <img
            src={user.photoURL || "/default-profile.png"}
            alt="Foto de perfil"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            {driverData.name} {driverData.lastname}
          </h1>
          <p className="text-lg text-gray-600">{driverData.email}</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-gray-700">
            <span className="font-semibold">Teléfono:</span>
            <span>{driverData.phoneNumber}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span className="font-semibold">Fecha de nacimiento:</span>
            <span>{driverData.birthday}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span className="font-semibold">Género:</span>
            <span>{driverData.selectedGender}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span className="font-semibold">ID de Usuario:</span>
            <span>{driverData.uid}</span>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <a
            href="#"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Editar Perfil
          </a>
          <button
            onClick={handleSignOut} // Llamar a la función de cierre de sesión
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-300"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@techconnect /src/database/firebaseConfiguration"; // Ajusta la ruta según tu proyecto

export default function UserReports() {
  const [userReports, setUserReports] = useState([]); // Estado para almacenar los datos
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  useEffect(() => {
    // Función para obtener los datos de usuarios desde Firebase
    const fetchUserReports = async () => {
      try {
        const usersQuery = query(
          collection(db, "drivers"),
          orderBy("createdAt", "desc")
        );
        const usersSnapshot = await getDocs(usersQuery);
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserReports(usersList);
        setLoading(false); // Finalizar la carga
      } catch (error) {
        console.error("Error al cargar los datos de usuarios:", error);
      }
    };

    fetchUserReports();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Drivers</h1>
      <div className="my-6 flex justify-center">
        <a
          href="/admin"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-300 transition"
        >
          Go back
        </a>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : userReports.length === 0 ? (
        <p className="text-gray-500 text-center">No user reports found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Nombre</th>
              <th className="border border-gray-300 px-4 py-2">Apellido</th>
              <th className="border border-gray-300 px-4 py-2">Correo</th>
              <th className="border border-gray-300 px-4 py-2">Teléfono</th>
              <th className="border border-gray-300 px-4 py-2">Contraseña</th>
            </tr>
          </thead>
          <tbody>
            {userReports.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2 text-center">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{user.lastname}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{user.email}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{user.phoneNumber}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{user.Password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

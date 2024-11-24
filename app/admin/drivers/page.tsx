"use client";

import { useEffect, useState } from "react";
import SettingsLoader from "@techconnect /src/components/settingsLoader";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "@techconnect /src/database/firebaseConfiguration"; // Ajusta la ruta según tu proyecto
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function UserReports() {
  const [userReports, setUserReports] = useState([]); // State to store user data
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // Estado que puede ser null, true o false

  const router = useRouter();

  useEffect(() => {
    // Function to fetch user data from Firebase
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
        setLoading(false); // End loading state
      } catch (error) {
        alert("Error loading user data: " + error.message);
      }
    };

    // Verificar si el usuario logueado es un admin
    const checkAdmin = async (userUid: string) => {
      const adminDoc = doc(db, "admin", userUid);
      const adminSnapshot = await getDoc(adminDoc); // Usamos getDoc para un único documento
      if (adminSnapshot.exists()) {
        setIsAdmin(true); // Si el documento existe, es admin
      } else {
        setIsAdmin(false); // Si no existe, no es admin
      }
    };

    // Detectar el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await checkAdmin(user.uid);
      } else {
        setIsAdmin(false); // Si no está logueado, no es admin
      }
    });

    fetchUserReports();
    return () => unsubscribe();
  }, []);

  // Si el estado de isAdmin es null o loading es true, mostramos el loader
  if (isAdmin === null || loading) {
    return <SettingsLoader />; // Muestra el loader mientras se carga
  }

  // Si no es admin, redirigir a la página de error
  if (isAdmin === false) {
    router.push("/error");
    return <SettingsLoader />;
  }

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
              <th className="border border-gray-300 px-4 py-2">
                Profile Picture
              </th>
              <th className="border border-gray-300 px-4 py-2">First Name</th>
              <th className="border border-gray-300 px-4 py-2">Last Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Phone</th>
            </tr>
          </thead>
          <tbody>
            {userReports.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <img
                    src={user.profileImage} // Here we add the profile image
                    alt={`${user.name} ${user.lastname}`}
                    className="w-12 h-12 rounded-full object-cover mx-auto"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {user.name}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {user.lastname}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {user.email}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {user.phoneNumber}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

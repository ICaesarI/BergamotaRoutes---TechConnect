"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@techconnect /src/database/firebaseConfiguration"; // Ajusta la ruta según tu proyecto
import paisaje from "@techconnect /src/img/PaisajeAdmin.webp";
import adminPanel from "@techconnect /src/img/admin-panel.png";
import adminIcon from "@techconnect /src/img/adminIcon.png";

import { useRouter } from "next/navigation";

import Image from "next/image";

export default function Admin() {
  const [userData, setUserData] = useState(null);
  const [totalErrors, setTotalErrors] = useState(0);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [totalRequest, setTotalRequest] = useState(0);
  const [recentDrivers, setRecentDrivers] = useState([]);
  const [lastIssue, setLastIssue] = useState(null);
  const [lastRequest, setLastRequest] = useState(null);

  const router = useRouter();

  useEffect(() => {
    // Manejo de autenticación
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const { uid } = user;
          // Obtener datos del administrador
          const adminDocRef = doc(db, "admin", uid);
          const adminDoc = await getDoc(adminDocRef);

          if (adminDoc.exists()) {
            setUserData(adminDoc.data());
          } else {
            console.warn("Usuario no encontrado en la colección 'admins'");
          }
        } catch (error) {
          console.error("Error al obtener datos del administrador:", error);
        }
      } else {
        console.warn("No hay usuario autenticado");
      }
    });

    // Obtener datos adicionales (errores, conductores, conductores más recientes, y el último issue)
    const fetchData = async () => {
      try {
        // Contar errores
        const issuesCollection = collection(db, "issues");
        const issuesSnapshot = await getDocs(issuesCollection);
        setTotalErrors(issuesSnapshot.docs.length);

        // Contar conductores
        const driversCollection = collection(db, "drivers");
        const driversSnapshot = await getDocs(driversCollection);
        setTotalDrivers(driversSnapshot.docs.length);

        // Contar Request
        const requestCollection = collection(db, "request");
        const requestSnapshot = await getDocs(requestCollection);
        setTotalRequest(requestSnapshot.docs.length);

        // Obtener los 3 conductores más recientes
        const driversQuery = query(
          collection(db, "drivers"),
          orderBy("createdAt", "desc"),
          limit(3)
        );
        const driversSnapshotRecent = await getDocs(driversQuery);
        const driversList = driversSnapshotRecent.docs.map((doc) => doc.data());
        setRecentDrivers(driversList);

        // Obtener el último "issue" registrado
        const issuesQuery = query(
          collection(db, "issues"),
          orderBy("createdAt", "desc"),
          limit(1)
        );

        // Obtener el último "request" registrado
        const requestQuery = query(
          collection(db, "request"),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const issuesSnapshotRecent = await getDocs(issuesQuery);
        const lastIssueData = issuesSnapshotRecent.docs[0]?.data();
        setLastIssue(lastIssueData || null);

        const requestSnapshotRecent = await getDocs(requestQuery);
        const lastrequestData = requestSnapshotRecent.docs[0]?.data();
        setLastRequest(lastrequestData || null);
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      }
    };

    fetchData();

    return () => unsubscribe(); // Limpiar listener al desmontar el componente
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 h-auto gap-4 p-4">
      {/* Left Side */}
      <div className="md:col-span-2 space-y-6">
        {/* Sección de bienvenida */}
        <div
          className="relative bg-blue-500 p-6 text-white flex items-center justify-between rounded-lg overflow-hidden"
          style={{
            backgroundImage: `url(${paisaje.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-blue-500/60"></div>
          <div className="relative z-10 space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold">
              Bienvenido, {userData?.name || "Admin"}
            </h1>
            <p className="text-sm sm:text-base">Have a good day</p>
          </div>
          <div className="relative z-10">
            <Image
              src={adminPanel}
              width={80}
              height={80}
              alt="Admin Panel"
              className="sm:w-[100px] sm:h-[100px]"
            />
          </div>
        </div>

        {/* Sección de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Total Errores */}
          <div className="bg-[#f2f3f7] rounded-xl p-5 shadow-md hover:shadow-lg transition border-2 border-red-500 hover:bg-red-500 group">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-red-500 rounded-full group-hover:bg-white"></div>
              <div>
                <p className="text-lg font-medium text-gray-800 group-hover:text-white">
                  Total Errores
                </p>
                <p className="text-red-500 font-bold text-xl group-hover:text-white">
                  {totalErrors}
                </p>
              </div>
            </div>
          </div>

          {/* Total Conductores */}
          <div className="bg-[#f2f3f7] rounded-xl p-5 shadow-md hover:shadow-lg transition border-2 border-green-500 hover:bg-green-500 group cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-500 rounded-full group-hover:bg-white"></div>
              <div>
                <p className="text-lg font-medium text-gray-800 group-hover:text-white">
                  Total Conductores
                </p>
                <p className="text-green-500 font-bold text-xl group-hover:text-white">
                  {totalDrivers}
                </p>
              </div>
            </div>
          </div>

          {/* Nuevas Solicitudes */}
          <div
            className="bg-[#f2f3f7] rounded-xl p-5 shadow-md hover:shadow-lg transition border-2 border-blue-500 hover:bg-blue-500 group cursor-pointer"
            onClick={() => router.push("/admin/request")}
          >
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full group-hover:bg-white"></div>
              <div>
                <p className="text-lg font-medium text-gray-800 group-hover:text-white">
                  Nuevas Solicitudes
                </p>
                <p className="text-blue-500 font-bold text-xl group-hover:text-white">
                  {totalRequest}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Último Issue */}
        <div>
          {lastIssue ? (
            <div className="bg-red-50 p-6 rounded-xl shadow-md hover:scale-105 transition">
              <h1 className="text-xl sm:text-2xl font-semibold mb-4">
                Último Issue
              </h1>
              <div className="bg-red-100 p-4 rounded-lg">
                <h2 className="text-lg font-bold text-red-700">
                  {lastIssue.description}
                </h2>
                <p className="text-gray-700 mt-2">
                  <strong>Fecha:</strong>{" "}
                  {new Date(
                    lastIssue.createdAt.seconds * 1000
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 font-medium">
              No hay issues registrados.
            </p>
          )}
        </div>
        {/* Último Request */}
        <div>
          {lastRequest ? (
            <div className="bg-blue-50 p-6 rounded-xl shadow-md hover:scale-105 transition">
              <h1 className="text-xl sm:text-2xl font-semibold mb-4">
                Último Request
              </h1>
              <div className="bg-blue-100 p-4 rounded-lg">
                <h2 className="text-lg font-bold text-blue-700">
                  {lastRequest.name} {lastRequest.lastname}
                </h2>
                <p className="text-gray-700 mt-2">
                  <strong>Fecha:</strong>{" "}
                  {new Date(
                    lastRequest.createdAt.seconds * 1000
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 font-medium">No hay Request Nuevos.</p>
          )}
        </div>
      </div>

      {/* Right Side */}
      <div className="space-y-6">
        {/* Admin Information */}
        <div className="bg-blue-500 text-center text-white font-bold rounded-lg p-4">
          <h1>My Profile</h1>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <Image
            src={adminIcon}
            width={80}
            height={80}
            alt="Admin Icon"
            className="rounded-full border border-gray-500"
          />
          <div className="text-center font-bold">
            <div>{userData?.name || "Admin"}</div>
            <div>{userData?.role || "Error"}</div>
          </div>
        </div>

        {/* New Drivers */}
        <div className="bg-blue-500 text-center text-white font-bold rounded-lg p-4">
          <h1>New Drivers</h1>
        </div>
        <div className="space-y-4">
          {recentDrivers.length > 0 ? (
            recentDrivers.map((driver, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="font-bold text-lg">
                  {driver.name} {driver.lastname}
                </h2>
                <p>Email: {driver.email}</p>
                <p>Teléfono: {driver.phoneNumber}</p>
                <p>
                  Registrado el:{" "}
                  {new Date(driver.createdAt.seconds * 1000).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No hay conductores recientes.</p>
          )}
        </div>
      </div>
    </div>
  );
}

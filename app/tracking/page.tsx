"use client";

import Image from "next/image";
import { useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "@techconnect /src/database/firebaseConfiguration";
import RoadImage from "@techconnect /src/img/roadImage.webp";
import TruckImage from "@techconnect /src/img/truckImage.png";
import PackageIcon from "@techconnect /src/img/packageIcon.svg";
import InputField from "@techconnect /src/components/inputField";
import { Card } from "@techconnect /src/components/card";
import MapComponent from "@techconnect /src/components/map/dinamicMap";
import Link from "next/link";
import { useAuth } from "@techconnect /src/auth/useAuth";
import TrackingList from "@techconnect /src/components/tracking/trackingList";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Tracking() {
  const [routeCode, setRouteCode] = useState("");
  const [trackingData, setTrackingData] = useState<any[]>([]);
  const [error, setError] = useState<{ coordinate?: string }>({});
  const [routeLocked, setRouteLocked] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // Estado para controlar la carga de la página
  const [isUserChecked, setIsUserChecked] = useState(false);

  const fetchTrackingData = async (routeCode: string) => {
    try {
      const routeRef = doc(db, "tracking", routeCode);
      const routeSnap = await getDoc(routeRef);

      const routeData = routeSnap.data();

      // Verifica si la ruta ya está asignada a otro conductor
      if (routeData.driverUID && routeData.driverUID !== user?.uid) {
        setRouteLocked(true);
        setError({
          coordinate:
            "Esta ruta ya está asignada a otro conductor y no puedes acceder a ella.",
        });
        setRouteLocked(false);
        return;
      }

      // Revisa si el campo `statusTracking` es "Finished"
      if (
        routeSnap.exists() &&
        routeSnap.data().statusTracking === "Finished"
      ) {
        setRouteLocked(false);
        console.warn("La ruta está finalizada y no se puede mostrar.");
        setError({ coordinate: "La ruta está finalizada o no existe." });
        return; // No cargar los datos de la ruta si está finalizada
      }

      const packagesRef = collection(db, "tracking", routeCode, "packages"); // Ruta a la colección de packages dentro de la ruta especificada
      const querySnapshot = await getDocs(packagesRef);
      const dataCollection: any[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const { address, location, number, statusDriver, statusTracking } =
          data;

        dataCollection.push({
          address: address || "No address provided",
          location: location || {
            _lat: "No latitude",
            _long: "No longitude",
          },
          number: number || "No number provided",
          statusDriver:
            statusDriver !== undefined ? statusDriver : "No status provided",
          uidPackage: doc.id, // Usa el ID del documento como uidPackage
          statusTracking: statusTracking,
        });
      });

      if (dataCollection.length > 0) {
        setTrackingData(dataCollection);
        setError({});
      } else {
        setError({ coordinate: "No se encontraron datos para esta ruta." });
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setError({ coordinate: "Error al obtener los datos." });
    }
  };

  useEffect(() => {
    // Verificar si el usuario está autenticado y si existe en la base de datos
    const checkUserInDatabase = async () => {
      if (!user) {
        router.push("/login"); // Redirige a la página de login si no hay usuario
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid); // Verifica si el usuario está en la colección 'users'
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // Si el usuario no está en la tabla 'users', redirige a otra página
          console.log("Usuario no encontrado en la base de datos.");
          router.push("/no-access"); // Redirige a una página de error o acceso denegado
          return;
        }
        // Si el usuario existe en la base de datos, cambiar el estado a true para cargar la página
        setIsUserChecked(true);
      } catch (error) {
        console.error("Error al verificar el usuario:", error);
        setError({ coordinate: "Error al verificar el usuario." });
        setIsUserChecked(true); // También aseguramos que la página cargue en caso de error
      }
    };

    const checkExistingRoute = async () => {
      if (user) {
        try {
          const driverRouteRef = doc(
            db,
            `drivers/${user.uid}/routes/actualRoute`
          );
          const routeSnap = await getDoc(driverRouteRef);

          if (routeSnap.exists() && routeSnap.data().routeUID) {
            const existingRouteUID = routeSnap.data().routeUID;
            setRouteCode(existingRouteUID); // Establece el código de ruta automáticamente
            setRouteLocked(true); // Bloquea el campo para evitar cambios
            fetchTrackingData(existingRouteUID); // Cargar automáticamente la información de la ruta
          }
        } catch (error) {
          console.error("Error al verificar la ruta actual:", error);
          setError({ coordinate: "Error al verificar la ruta actual." });
        }
      }
    };

    checkExistingRoute();
    checkUserInDatabase();
  }, [user, router]); // Ejecuta la verificación cuando el usuario o router cambien

  // Si la verificación del usuario no ha terminado, no renderizar nada
  if (!isUserChecked) {
    return null; // No renderizar nada mientras se verifica
  }

  // Función para iniciar la ruta y actualizar tanto el documento de la ruta como el del driver
  const startRoute = async () => {
    if (user && routeCode) {
      try {
        const routeRef = doc(db, "tracking", routeCode);
        const driverRouteRef = doc(
          db,
          `drivers/${user.uid}/routes/actualRoute`
        );

        // Actualiza el documento de la ruta y crea el subdocumento `actualRoute` si no existe
        await Promise.all([
          updateDoc(routeRef, {
            driverUID: user.uid, // Agrega el UID del driver a la ruta
          }),
          setDoc(
            driverRouteRef,
            {
              routeUID: routeCode, // Crea el subdocumento actualRoute si no existe y guarda el UID de la ruta
            },
            { merge: true }
          ), // Usa merge para no sobreescribir otros datos
        ]);

        console.log("Ruta y driver actualizados con éxito.");
      } catch (error) {
        console.error("Error al iniciar la ruta:", error);
      }
    } else {
      console.error("Usuario no autenticado o ruta no válida");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 p-5">
      <div>
        {/* Input and button disabled if the route is already assigned */}
        <div className="m-3 flex flex-col justify-between">
          <InputField
            label="Enter route code"
            placeholder="e.g. XtDAkCIWcvLpetIkTEWn"
            value={routeCode}
            onChange={(value) => !routeLocked && setRouteCode(value)}
            backgroundInput="bg-white"
            textColor="black"
            icon={PackageIcon}
            disabled={routeLocked}
          />
          <button
            onClick={() => fetchTrackingData(routeCode)}
            className={`mt-4 w-full ${
              routeLocked ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            } text-white font-bold py-2 px-4 rounded`}
            disabled={routeLocked}
          >
            {routeLocked ? "Route Assigned" : "Add Route"}
          </button>
          {error.coordinate && (
            <p className="text-red-500 text-sm">{error.coordinate}</p>
          )}
        </div>

        {/* Display route data automatically if it is locked */}
        {trackingData.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-700 mb-3">
              Route Information:
            </h2>
            <TrackingList trackingData={trackingData} />
            <div className="mt-4 flex justify-end">
              <Link
                href={`/map/${routeCode}`}
                className="codepen-button mt-4 w-2/4 text-center"
                onClick={startRoute}
              >
                <span>Start Route</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center ml-32">
        {trackingData.length > 0 ? (
          <MapComponent routeCode={routeCode} />
        ) : (
          <Card />
        )}
      </div>
    </div>
  );
}

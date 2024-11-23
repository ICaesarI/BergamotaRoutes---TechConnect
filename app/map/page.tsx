"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2"; // Importar Swal
import MapComponent from "@techconnect /src/components/map/map"; // Asegúrate de que la ruta sea correcta

export default function Map() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthorization = async () => {
      // Aquí puedes agregar la lógica de autorización según lo que necesites
      try {
        // Simulamos una validación de autorización, por ejemplo, si el usuario está logueado o no.
        const user = null; // Si el usuario no está logueado, cambialo a `null`

        if (!user) {
          // Mostrar un mensaje de error con Swal
          Swal.fire({
            icon: "error",
            title: "No Autorizado",
            text: "Debes iniciar sesión para acceder a esta página.",
            confirmButtonText: "Iniciar sesión",
          }).then(() => {
            router.push("/login"); // Redirigir después de que el usuario cierre el Swal
          });
          return;
        }

        // Si el usuario está autorizado, actualizamos el estado
        setIsAuthorized(true);
      } catch (error) {
        // Mostrar un mensaje de error con Swal en caso de que haya un error en la autorización
        Swal.fire({
          icon: "error",
          title: "Error de Autorización",
          text: "Hubo un problema al verificar tus permisos.",
          confirmButtonText: "Aceptar",
        }).then(() => {
          router.push("/not-authorized"); // Redirigir después de que el usuario cierre el Swal
        });
      }
    };

    checkAuthorization();
  }, [router]);

  if (!isAuthorized) {
    return null; // O redirigir a una página de error mientras se espera la autorización
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center min-h-screen bg-gray-50 h-screen">
      {/* Sidebar de configuración */}
      <div className="bg-green-bold flex flex-col justify-between h-full p-4">
        <h1 className="font-bold text-lg text-white">Configuration</h1>
        <div>
          <button className="shadow-lg bg-yellow-alert text-white font-bold py-2 px-4 rounded hover:bg-yellow-alert-hover">
            Report Route Error
          </button>
        </div>
      </div>

      {/* Componente del Mapa */}
      <div className="h-full w-full col-span-2">
        <MapComponent />
      </div>
    </div>
  );
}

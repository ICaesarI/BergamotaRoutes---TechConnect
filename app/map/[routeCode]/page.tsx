"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@techconnect /src/database/firebaseConfiguration";
import MapComponent from "@techconnect /src/components/map/map";
import { useParams } from 'next/navigation';
import Swal from "sweetalert2"; // Importar Swal

interface MapPageProps {
  params: { routeCode: string };
}

export default function Map({ params }: MapPageProps) {
  const { routeCode } = useParams();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthorization = async () => {
      const user = auth.currentUser;

      if (!user) {
        // Mostrar un alerta con Swal en vez de redirigir inmediatamente
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

      try {
        const driverUID = user.uid;

        // Obtener el documento de la ruta en `tracking/{routeCode}`
        const routeDoc = await getDoc(doc(db, `tracking/${routeCode}`));

        if (routeDoc.exists()) {
          const routeData = routeDoc.data();

          // Verificar si el UID del conductor coincide con el `driverUID` en el documento
          if (routeData.driverUID === driverUID) {
            setIsAuthorized(true);
          } else {
            // Mostrar un alerta con Swal en vez de redirigir inmediatamente
            Swal.fire({
              icon: "error",
              title: "No Autorizado",
              text: "No tienes permisos para acceder a esta ruta.",
              confirmButtonText: "Aceptar",
            }).then(() => {
              router.push("/not-authorized"); // Redirigir después de que el usuario cierre el Swal
            });
          }
        } else {
          // Mostrar un alerta con Swal en vez de redirigir inmediatamente
          Swal.fire({
            icon: "error",
            title: "Ruta no encontrada",
            text: "No se pudo encontrar la ruta solicitada.",
            confirmButtonText: "Aceptar",
          }).then(() => {
            router.push("/not-found"); // Redirigir después de que el usuario cierre el Swal
          });
        }
      } catch (error) {
        console.error("Error verificando autorización:", error);
        // Mostrar un alerta con Swal en caso de error
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
  }, [routeCode, router]);

  // Si no está autorizado, no se muestra nada en la página
  if (!isAuthorized) {
    return null; // O redirigir a una página de error
  }

  return (
    <div className="min-h-screen h-screen">
      <div className="h-full w-full">
        {/* Pasamos el routeCode al componente MapComponent */}
        <MapComponent routeCode={routeCode} />
      </div>
    </div>
  );
}

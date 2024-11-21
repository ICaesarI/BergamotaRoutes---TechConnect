"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@techconnect /src/database/firebaseConfiguration";
import MapComponent from "@techconnect /src/components/map/map";
import { useParams } from 'next/navigation';

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
        router.push("/login");
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
            router.push("/not-authorized");
          }
        } else {
          router.push("/not-found");
        }
      } catch (error) {
        console.error("Error verificando autorización:", error);
        router.push("/not-authorized");
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

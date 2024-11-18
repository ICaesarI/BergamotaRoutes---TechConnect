"use client";

import { useState, useEffect } from "react";
import { Header } from "./Header";
import { DriveHeader } from "./DriveHeader";
import { AdminHeader } from "./AdminHeader";
import {
  auth,
  onAuthStateChanged,
} from "@techconnect /src/database/firebaseConfiguration";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@techconnect /src/database/firebaseConfiguration";

export function MainLayout() {
  const [userType, setUserType] = useState<"driver" | "admin" | "guest">(
    "guest"
  );

  useEffect(() => {
    // Observa el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Si el usuario está autenticado, busca su tipo en Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserType(data.role || "guest"); // Define el tipo de usuario basado en Firestore
          } else {
            setUserType("guest"); // Si no hay datos del usuario
          }
        } catch (error) {
          console.error("Error obteniendo el tipo de usuario:", error);
          setUserType("guest");
        }
      } else {
        setUserType("guest"); // Si no hay sesión activa
      }
    });

    // Limpiar el observador cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  // Renderiza el header según el tipo de usuario
  return (
    <>
      {userType === "driver" && <DriveHeader />}
      {userType === "admin" && <AdminHeader />}
      {userType === "guest" && <Header />}
    </>
  );
}

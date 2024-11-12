"use client";

import { useState, useEffect } from "react";
import { Header } from "./Header";
import { DriveHeader } from "./DriveHeader";
import { auth, onAuthStateChanged } from "@techconnect /src/database/firebaseConfiguration";

export function MainLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verifica el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Si hay un usuario, se considera autenticado
    });

    // Limpiar el observador cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  return (
    <>
      {isAuthenticated ? <DriveHeader /> : <Header />}
    </>
  );
}

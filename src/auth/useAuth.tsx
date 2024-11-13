import { useState, useEffect, createContext, useContext } from "react";
import { auth } from "../database/firebaseConfiguration";
import { onAuthStateChanged, User } from "firebase/auth";

// Crear el contexto de autenticación
const AuthContext = createContext(null);

// Proveer el contexto a los componentes
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Establecer el usuario logueado
      } else {
        setUser(null); // Si no hay usuario, establecer como null
      }
    });

    // Limpiar la suscripción cuando el componente se desmonta
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

// Hook para acceder al usuario logueado
export const useAuth = () => {
  return useContext(AuthContext);
};

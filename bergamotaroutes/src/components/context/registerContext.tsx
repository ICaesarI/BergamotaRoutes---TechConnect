"use client";

import { createContext, useState, useContext } from "react";

// Crea un contexto vacío llamado `RegisterContext`
const RegisterContext = createContext();

// Custom hook para acceder al contexto de registro
export function useRegister() {
  return useContext(RegisterContext);
}

// Proveedor del contexto
export function RegisterProvider({ children }) {
  // Maneja el estado local de los datos del registro
  const [registerData, setRegisterData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    birthday: "",
    profileImage: "",
    selectedGender: "",
  });

  // Función para actualizar los datos del registro
  const updateRegisterData = (newData) => {
    console.log("Datos actualizados:", newData);
    setRegisterData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  // Devuelve el contexto para que los componentes puedan acceder a los datos y funciones
  return (
    <RegisterContext.Provider value={{ registerData, updateRegisterData }}>
      {children}
    </RegisterContext.Provider>
  );
}

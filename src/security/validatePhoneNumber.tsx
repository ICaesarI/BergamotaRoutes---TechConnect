"use client";
// components/PhoneNumberValidator.tsx

export const validatePhoneNumber = (phoneNumber: string): string | null => {
  // Verificar si el campo está vacío
  if (!phoneNumber || phoneNumber.trim().length === 0) {
    return "El número de teléfono es obligatorio."; // Mensaje si el campo está vacío
  }

  // Expresión regular que valida números de 10 dígitos
  const phoneRegex = /^[0-9]{10}$/;
  
  // Verificar si el teléfono cumple con la expresión regular
  if (!phoneRegex.test(phoneNumber)) {
    return "El número de teléfono debe contener exactamente 10 dígitos."; // Mensaje si no cumple con el formato
  }

  return null; // Si todo es correcto, devuelve null (sin errores)
};

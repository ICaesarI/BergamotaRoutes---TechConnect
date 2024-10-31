"use client";
// components/PhoneNumberValidator.tsx
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/; // Expresión regular que valida números de 10 dígitos.
  return phoneRegex.test(phone);
};

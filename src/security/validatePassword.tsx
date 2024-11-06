export const validatePasswordInput = (password: string): boolean => {
  // Verificar si la contraseña está vacía
  if (!password || password.trim().length === 0) {
    return false;
  }

  // Verificar longitud mínima y máxima (ej. mínimo 8, máximo 20 caracteres)
  if (password.length < 8 || password.length > 20) {
    return false;
  }

  // Verificar si tiene al menos una letra mayúscula
  const hasUpperCase = /[A-Z]/.test(password);
  if (!hasUpperCase) {
    return false;
  }

  // Verificar si tiene al menos una letra minúscula
  const hasLowerCase = /[a-z]/.test(password);
  if (!hasLowerCase) {
    return false;
  }

  // Verificar si tiene al menos un número
  const hasNumber = /\d/.test(password);
  if (!hasNumber) {
    return false;
  }

  // Verificar si tiene al menos un carácter especial
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  if (!hasSpecialChar) {
    return false;
  }

  return true;
};

export const validateName = (name: string): boolean => {
  // Verificar si el nombre está vacío
  if (!name || name.trim().length === 0) {
    return false;
  }

  // Verificar si el nombre contiene solo letras y opcionalmente espacios
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nameRegex.test(name)) {
    return false;
  }

  // Verificar longitud mínima y máxima (mínimo 2, máximo 50 caracteres)
  if (name.length < 2 || name.length > 50) {
    return false;
  }

  // Otras validaciones personalizadas (ej. evitar nombres prohibidos)
  const forbiddenNames = ["Admin", "Usuario", "Test"];
  if (forbiddenNames.includes(name)) {
    return false;
  }

  // Si todas las validaciones pasaron, devolver true
  return true;
};

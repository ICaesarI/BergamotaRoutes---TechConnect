export const validateBirthday = (birthday: string): string | null => {
  // Verificar si el campo está vacío
  if (!birthday.trim()) {
    return "La fecha de nacimiento es obligatoria."; // Campo vacío
  }

  const today = new Date();
  const birthDate = new Date(birthday);

  // Verificar si la fecha ingresada es válida
  if (isNaN(birthDate.getTime())) {
    return "La fecha de nacimiento es invalida."; // Fecha inválida
  }

  // Calcular la diferencia en años
  let age = today.getFullYear() - birthDate.getFullYear();

  // Ajustar si aún no ha cumplido años este año
  const hasBirthdayPassed = 
    today.getMonth() > birthDate.getMonth() || 
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    age--; // Restar un año si el cumpleaños aún no ha pasado
  }

  // Validar si la persona es mayor de edad
  if (age < 18) {
    return "Debes tener al menos 18 años"; // Persona menor de edad
  }

  // Si todo está bien, devolver null (sin error)
  return null;
};

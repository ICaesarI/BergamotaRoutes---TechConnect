export const validateBirthday = (birthday: string): boolean => {
  const today = new Date();
  const birthDate = new Date(birthday);

  // Verificar si la fecha ingresada es válida
  if (isNaN(birthDate.getTime())) {
    return false; // Fecha inválida
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

  // Validar si la fecha es pasada y la persona es mayor de edad
  return age >= 18;
};

export const validateBirthday = (birthday: string): boolean => {
  const today = new Date();
  const birthDate = new Date(birthday);
  return birthDate < today; // Debe ser una fecha pasada
};

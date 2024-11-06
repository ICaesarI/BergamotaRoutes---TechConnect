export const validateImage = (file: File): boolean => {
  const allowedFormats = ["image/jpeg", "image/png", "image/gif"];
  return allowedFormats.includes(file.type); // Validación de tipos de imagen
};

export const validateImage = (file: File | null): string | null  => {
  if (!file) {
    return "La imagen es obligatoria."; // Mensaje si no se selecciona una imagen
  }
  const allowedFormats = ["image/jpeg", "image/png", "image/gif"];
  // Verificar el formato de la imagen
  if (allowedFormats.includes(file.type)) {
    return "El formato de la imagen no es válido. Solo se permiten archivos JPG, PNG y GIF."; // Mensaje si el formato no es válido
  }

  // Si todas las validaciones son correctas, devolver null
  return null;
};
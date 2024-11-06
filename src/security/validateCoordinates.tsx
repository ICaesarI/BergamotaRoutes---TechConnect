export const validateCoordinates = (coordinate: string): boolean => {
  // Verifica si la coordenada está vacía o no
  if (!coordinate || coordinate.trim().length === 0) {
    return false;
  }

  // Verifica si la coordenada está en el formato correcto (latitud, longitud)
  const coordinatePattern = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
  if (!coordinatePattern.test(coordinate)) {
    return false;
  }

  // Extrae la latitud y longitud
  const [latitude, longitude] = coordinate.split(",").map(Number);

  // Verifica si la latitud está en el rango válido
  if (latitude < -90 || latitude > 90) {
    return false;
  }

  // Verifica si la longitud está en el rango válido
  if (longitude < -180 || longitude > 180) {
    return false;
  }

  return true;
};

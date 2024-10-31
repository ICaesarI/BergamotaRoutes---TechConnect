// Importa la biblioteca Leaflet para manejar coordenadas y mapas.
import L from "leaflet";

// Clave de API para OpenRouteService (sustituye con tu propia clave).
const API_KEY = "5b3ce3597851110001cf624899fc548b5f4045d09133e855f8a2a9b9";
// URL de la API de OpenRouteService para direcciones en automóvil.
const ORS_URL = "https://api.openrouteservice.org/v2/directions/driving-car";

// Función para decodificar la geometría de la ruta desde una cadena codificada en formato polyline.
const decodePolyline = (polyline: string): [number, number][] => {
  // Arreglo para almacenar las coordenadas decodificadas.
  const coordinates: [number, number][] = [];
  let index = 0, // Índice para recorrer la cadena codificada.
    lat = 0, // Coordenada de latitud acumulada.
    lng = 0; // Coordenada de longitud acumulada.

  // Mientras queden caracteres en la cadena codificada.
  while (index < polyline.length) {
    let b,
      shift = 0,
      result = 0;

    // Decodificar latitud.
    do {
      b = polyline.charCodeAt(index++) - 63; // Ajusta el valor del carácter.
      result |= (b & 0x1f) << shift; // Aplica el desplazamiento.
      shift += 5; // Incrementa el desplazamiento.
    } while (b >= 0x20); // Continúa hasta que el carácter sea menor a 0x20.
    const dlat = (result >> 1) ^ -(result & 1); // Calcula la diferencia de latitud.
    lat += dlat; // Actualiza la latitud acumulada.

    shift = 0; // Reinicia el desplazamiento para la longitud.
    result = 0; // Reinicia el resultado.

    // Decodificar longitud.
    do {
      b = polyline.charCodeAt(index++) - 63; // Ajusta el valor del carácter.
      result |= (b & 0x1f) << shift; // Aplica el desplazamiento.
      shift += 5; // Incrementa el desplazamiento.
    } while (b >= 0x20); // Continúa hasta que el carácter sea menor a 0x20.
    const dlng = (result >> 1) ^ -(result & 1); // Calcula la diferencia de longitud.
    lng += dlng; // Actualiza la longitud acumulada.

    // Añade las coordenadas decodificadas al arreglo, dividiendo por 1e5 para convertir a grados.
    coordinates.push([lat / 1e5, lng / 1e5]);
  }

  // Devuelve las coordenadas decodificadas.
  return coordinates;
};

// Función asíncrona para obtener la ruta de OpenRouteService.
export const fetchRouteFromORS = async (
  start: L.LatLng, // Coordenadas de inicio.
  waypoints: { lat: number; lng: number; label: string }[] // Lista de puntos intermedios.
): Promise<L.LatLng[]> => {
  // Crea un arreglo de coordenadas, comenzando con las coordenadas de inicio.
  const coordinates = [
    [start.lng, start.lat], // Primero las coordenadas de inicio.
    ...waypoints.map((wp) => [wp.lng, wp.lat]), // Añade las coordenadas de los waypoints.
  ];

  try {
    // Realiza una solicitud POST a la API de OpenRouteService.
    const response = await fetch(ORS_URL, {
      method: "POST", // Método de la solicitud.
      headers: {
        "Content-Type": "application/json", // Especifica el tipo de contenido.
        Authorization: API_KEY, // Añade la clave de API a los encabezados.
      },
      // Cuerpo de la solicitud con las coordenadas y sin instrucciones.
      body: JSON.stringify({
        coordinates: coordinates,
        instructions: false,
      }),
    });

    // Verifica si la respuesta es exitosa.
    if (!response.ok) {
      const errorData = await response.json(); // Obtiene el mensaje de error.
      throw new Error(`Error fetching route: ${errorData.message}`); // Lanza un error si la respuesta no es correcta.
    }

    const data = await response.json(); // Convierte la respuesta a JSON.
    console.log("API Response:", data); // Muestra la respuesta de la API en la consola.
    if (data.routes.length > 0) {
      console.log("First Route:", data.routes[0]); // Muestra la primera ruta si existe.
    }

    // Verifica si se encontraron rutas válidas y si hay geometría definida.
    if (!data.routes || data.routes.length === 0 || !data.routes[0].geometry) {
      console.error("No valid route found or geometry is undefined."); // Muestra un error si no hay rutas válidas.
      return []; // Devuelve un arreglo vacío.
    }

    // Decodifica la geometría de la ruta utilizando la función anterior.
    const decodedCoordinates = decodePolyline(data.routes[0].geometry);
    // Convierte las coordenadas decodificadas a objetos L.LatLng de Leaflet.
    return decodedCoordinates.map(([lat, lng]) => L.latLng(lat, lng));
  } catch (error) {
    // Captura cualquier error durante la solicitud y lo muestra en la consola.
    console.error("Error al obtener la ruta de OpenRouteService:", error);
    return []; // Devuelve un arreglo vacío en caso de error.
  }
};

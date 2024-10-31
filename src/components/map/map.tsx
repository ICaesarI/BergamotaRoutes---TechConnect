// Importa los hooks de React necesarios.
import { useEffect, useRef, useState } from "react";
// Importa la biblioteca Leaflet para manejar mapas.
import L from "leaflet";
// Importa el archivo CSS de Leaflet para aplicar estilos predeterminados.
import "leaflet/dist/leaflet.css";
// Importa la máquina de enrutamiento de Leaflet.
import "leaflet-routing-machine";
// Importa el componente para mostrar la ubicación del usuario.
import LocationMarker from "./LocationMarker";
// Importa el componente para mostrar otros marcadores.
import OtherMarkers from "./OtherMarkers";
// Importa la función para optimizar la ruta.
import { optimizeRoute } from "./RouteOptimizer";
// Importa la función para obtener rutas de OpenRouteService.
import { fetchRouteFromORS } from "./RouteService";

// Define el componente funcional MapComponent.
const MapComponent: React.FC = () => {
  // Crea una referencia para el mapa de Leaflet.
  const mapRef = useRef<L.Map | null>(null);
  // Crea una referencia para la ubicación del usuario.
  const userLocationRef = useRef<L.LatLng | null>(null);
  // Estado para almacenar los marcadores ordenados por distancia.
  const [sortedMarkers, setSortedMarkers] = useState<
    { lat: number; lng: number; label: string; distance: number }[]
  >([]);

  // Datos de los otros marcadores en el mapa.
  const otherMarkersData = useRef([
    { lat: 20.655152217635692, lng: -103.32543897713083, label: "CUCEI" },
    {
      lat: 20.651166606563386,
      lng: -103.31960249016042,
      label: "La Vid Restaurant",
    },
    { lat: 20.649670720513537, lng: -103.30730724417981, label: "McDonald's" },
    {
      lat: 20.62305742861593,
      lng: -103.06885345787988,
      label: "Zapotlanejo Centro",
    },
  ]).current;

  // useEffect para ejecutar el código una vez que el componente se monta.
  useEffect(() => {
    // Verifica si el mapa no ha sido inicializado aún.
    if (!mapRef.current) {
      // Inicializa el mapa en una ubicación y zoom específicos.
      mapRef.current = L.map("map").setView([-34.617, -58.383], 13);
      // Añade una capa de mapa de OpenStreetMap.
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    // Función para obtener la ubicación del usuario y los marcadores.
    const fetchLocationAndMarkers = async () => {
      try {
        // Promesa para obtener la ubicación del usuario.
        const userLocation = await new Promise<L.LatLng>((resolve, reject) => {
          if (navigator.geolocation) {
            // Usa la API de geolocalización del navegador.
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                // Resuelve la promesa con la ubicación del usuario.
                resolve(L.latLng(latitude, longitude));
              },
              (error) => {
                // Manejo de errores si no se puede obtener la ubicación.
                console.error("Error obteniendo la ubicación:", error);
                reject(error);
              }
            );
          } else {
            // Alerta si la geolocalización no es soportada.
            alert("La geolocalización no es soportada por este navegador.");
            reject(new Error("Geolocation not supported"));
          }
        });

        // Almacena la ubicación del usuario en la referencia.
        userLocationRef.current = userLocation;

        // Calcula las distancias a los otros marcadores.
        const distances = otherMarkersData.current.map(
          ({ lat, lng, label }) => {
            const markerLocation = L.latLng(lat, lng);
            const distance =
              userLocationRef.current?.distanceTo(markerLocation) || 0;
            return { lat, lng, label, distance: distance / 1000 }; // Convierte metros a kilómetros.
          }
        );

        // Optimiza la ruta usando la ubicación del usuario y las distancias calculadas.
        const optimizedRoute = optimizeRoute(
          userLocationRef.current,
          distances
        );

        // Actualiza el estado con los marcadores ordenados.
        setSortedMarkers(optimizedRoute);

        // Log de la ubicación de inicio y puntos intermedios.
        console.log("Start Location:", userLocationRef.current);
        console.log("Waypoints:", optimizedRoute);

        // Solicita la ruta a OpenRouteService.
        const routeCoordinates = await fetchRouteFromORS(
          userLocationRef.current,
          optimizedRoute
        );

        // Log de las coordenadas de la ruta.
        console.log("Route Coordinates:", routeCoordinates);

        // Dibuja la ruta en el mapa si hay coordenadas disponibles.
        if (mapRef.current && routeCoordinates.length > 0) {
          L.polyline(routeCoordinates, { color: "blue", weight: 4 }).addTo(
            mapRef.current
          );
        }
      } catch (error) {
        // Manejo de errores en la obtención de la ubicación o marcadores.
        console.error(
          "Error en la obtención de la ubicación o marcadores:",
          error
        );
      }
    };

    // Llama a la función para obtener la ubicación y marcadores.
    fetchLocationAndMarkers();

    // Función de limpieza para eliminar el mapa al desmontar el componente.
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Renderiza el componente.
  return (
    <>
      {/* Contenedor del mapa con dimensiones específicas. */}
      <div id="map" style={{ height: "500px", width: "100%" }} />
      {/* Renderiza el marcador de ubicación del usuario si está disponible. */}
      {userLocationRef.current && (
        <LocationMarker
          userLocation={userLocationRef.current}
          map={mapRef.current!}
        />
      )}
      {/* Renderiza otros marcadores en el mapa. */}
      <OtherMarkers markers={otherMarkersData} map={mapRef.current!} />
      {/* Renderiza la lista de marcadores ordenados si existen. */}
      {sortedMarkers.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold">Ruta Optimizada:</h3>
          <ul className="flex">
            {sortedMarkers.map((marker) => (
              <li
                key={marker.label}
                className="bg-white  border border-black-main rounded items-center justify-between gap-4 p-4"
              >
                {marker.label}: {marker.distance.toFixed(2)} km
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

// Exporta el componente para que pueda ser utilizado en otras partes de la aplicación.
export default MapComponent;

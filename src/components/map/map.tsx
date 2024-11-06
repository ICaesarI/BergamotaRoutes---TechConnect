<<<<<<< HEAD
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
import { db } from "@techconnect /src/database/firebaseConfiguration"; // Asegúrate de que la ruta sea correcta
import { addDoc, collection, updateDoc, doc, getDocs } from "firebase/firestore";

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
<<<<<<< HEAD:src/components/map/map.tsx

  // Datos de los otros marcadores en el mapa.
=======
  const [packages, setPackages] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  
>>>>>>> chino:bergamotaroutes/src/components/map/map.tsx
  const otherMarkersData = useRef([
    { lat: 20.655152217635692, lng: -103.32543897713083, label: "CUCEI" },
    { lat: 20.651166606563386, lng: -103.31960249016042, label: "La Vid Restaurant" },
    { lat: 20.649670720513537, lng: -103.30730724417981, label: "McDonald's" },
<<<<<<< HEAD:src/components/map/map.tsx
=======
"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link"; // Importar Link
import "leaflet-routing-machine";
import LocationMarker from "./LocationMarker";
import OtherMarkers from "./OtherMarkers";
import { optimizeRoute } from "./RouteOptimizer";
import { fetchRouteFromORS } from "./RouteService";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@techconnect /src/database/firebaseConfiguration";
import DisplayLoader from "../loader";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const MapComponent: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const userLocationRef = useRef<L.LatLng | null>(null);
  const [sortedMarkers, setSortedMarkers] = useState<
    { lat: number; lng: number; label: string; distance: number }[]
  >([]);
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
  const [clickedRoutes, setClickedRoutes] = useState<Set<number>>(new Set());
  const [reportVisible, setReportVisible] = useState(false); // Estado para el formulario
  const [loading, setLoading] = useState(true); // Estado para el loading

  const otherMarkersData = useRef([
    { lat: 20.655152217635692, lng: -103.32543897713083, label: "CUCEI" },
    {
      lat: 20.651166606563386,
      lng: -103.31960249016042,
      label: "La Vid Restaurant",
    },
    { lat: 20.649670720513537, lng: -103.30730724417981, label: "McDonald's" },
>>>>>>> origin
    {
      lat: 20.62305742861593,
      lng: -103.06885345787988,
      label: "Zapotlanejo Centro",
    },
<<<<<<< HEAD
=======
    { lat: 20.62305742861593, lng: -103.06885345787988, label: "Zapotlanejo Centro" }
>>>>>>> chino:bergamotaroutes/src/components/map/map.tsx
  ]).current;

  // useEffect para ejecutar el código una vez que el componente se monta.
  useEffect(() => {
    // Verifica si el mapa no ha sido inicializado aún.
    if (!mapRef.current) {
      // Inicializa el mapa en una ubicación y zoom específicos.
      mapRef.current = L.map("map").setView([-34.617, -58.383], 13);
      // Añade una capa de mapa de OpenStreetMap.
=======
    {
      lat: 20.64333196713651,
      lng: -103.32513769834855,
      label: "La Casa del Chivo",
    },
  ]).current;

  const swiperRef = useRef<any>(null); // Referencia para controlar Swiper

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        center: [-34.617, -58.383],
        zoom: 13,
        minZoom: 10, // Zoom mínimo
        maxZoom: 18, // Zoom máximo
      });
>>>>>>> origin
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
<<<<<<< HEAD
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
=======

      // Permitir desplazamiento
      mapRef.current.scrollWheelZoom.enable();
    }

    const fetchLocationAndMarkers = async () => {
      try {
        const userLocation = await new Promise<L.LatLng>((resolve, reject) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                resolve(L.latLng(latitude, longitude));
              },
              (error) => {
>>>>>>> origin
                console.error("Error obteniendo la ubicación:", error);
                reject(error);
              }
            );
          } else {
<<<<<<< HEAD
            // Alerta si la geolocalización no es soportada.
=======
>>>>>>> origin
            alert("La geolocalización no es soportada por este navegador.");
            reject(new Error("Geolocation not supported"));
          }
        });

<<<<<<< HEAD
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
=======
        userLocationRef.current = userLocation;

        const distances = otherMarkersData.map(({ lat, lng, label }) => {
          const markerLocation = L.latLng(lat, lng);
          const distance =
            userLocationRef.current?.distanceTo(markerLocation) || 0;
          return { lat, lng, label, distance: distance / 1000 };
        });

>>>>>>> origin
        const optimizedRoute = optimizeRoute(
          userLocationRef.current,
          distances
        );
<<<<<<< HEAD

        // Actualiza el estado con los marcadores ordenados.
        setSortedMarkers(optimizedRoute);

<<<<<<< HEAD:src/components/map/map.tsx
        // Log de la ubicación de inicio y puntos intermedios.
        console.log("Start Location:", userLocationRef.current);
        console.log("Waypoints:", optimizedRoute);

        // Solicita la ruta a OpenRouteService.
=======
        // Solicitar la ruta a OpenRouteService
>>>>>>> chino:bergamotaroutes/src/components/map/map.tsx
=======
        setSortedMarkers(optimizedRoute);

>>>>>>> origin
        const routeCoordinates = await fetchRouteFromORS(
          userLocationRef.current,
          optimizedRoute
        );
<<<<<<< HEAD

<<<<<<< HEAD:src/components/map/map.tsx
        // Log de las coordenadas de la ruta.
        console.log("Route Coordinates:", routeCoordinates);

        // Dibuja la ruta en el mapa si hay coordenadas disponibles.
=======
        // Dibujar la ruta en el mapa
>>>>>>> chino:bergamotaroutes/src/components/map/map.tsx
=======
>>>>>>> origin
        if (mapRef.current && routeCoordinates.length > 0) {
          L.polyline(routeCoordinates, { color: "blue", weight: 4 }).addTo(
            mapRef.current
          );
        }
      } catch (error) {
<<<<<<< HEAD
<<<<<<< HEAD:src/components/map/map.tsx
        // Manejo de errores en la obtención de la ubicación o marcadores.
=======
>>>>>>> origin
        console.error(
          "Error en la obtención de la ubicación o marcadores:",
          error
        );
<<<<<<< HEAD
=======
        console.error("Error en la obtención de la ubicación o marcadores:", error);
>>>>>>> chino:bergamotaroutes/src/components/map/map.tsx
      }
    };

    // Llama a la función para obtener la ubicación y marcadores.
    fetchLocationAndMarkers();

<<<<<<< HEAD:src/components/map/map.tsx
    // Función de limpieza para eliminar el mapa al desmontar el componente.
=======
    // Fetch packages from Firestore
    const fetchPackages = async () => {
      const querySnapshot = await getDocs(collection(db, "packages"));
      const packagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPackages(packagesData);
    };

    fetchPackages();

>>>>>>> chino:bergamotaroutes/src/components/map/map.tsx
=======
      } finally {
        setLoading(false); // Ocultar el loading al finalizar
      }
    };

    fetchLocationAndMarkers();

>>>>>>> origin
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

<<<<<<< HEAD
<<<<<<< HEAD:src/components/map/map.tsx
  // Renderiza el componente.
=======
  // Función para actualizar el estado del paquete en Firestore
  const updatePackageStatus = async (packageId: string, currentStatus: string) => {
    const packageRef = doc(db, "packages", packageId);
    let newStatus = "";
    let showRoute = false;

    if (currentStatus === "Saliendo del almacén") {
      newStatus = "En camino";
    } else if (currentStatus === "En camino") {
      newStatus = "El driver se dirige a tu domicilio";
      showRoute = true; // Solo mostrar ruta si está en este estado
    } else {
      newStatus = "Saliendo del almacén"; // Regresar al primer estado
    }

    const updatedData = {
      status: newStatus,
      step: newStatus,
      message: newStatus === "El driver se dirige a tu domicilio"
        ? "El paquete ha salido para su entrega."
        : `El paquete está ${newStatus.toLowerCase()}.`,
      showRoute: showRoute,
    };

    try {
      await updateDoc(packageRef, updatedData);
      console.log("Estado del paquete actualizado:", updatedData);
      // Actualizar la lista de paquetes
      const updatedPackages = packages.map(pkg =>
        pkg.id === packageId ? { ...pkg, ...updatedData } : pkg
      );
      setPackages(updatedPackages);
      setMessage(`Paquete ${packageId} actualizado a ${newStatus}`); // Mensaje de éxito
    } catch (error) {
      console.error("Error al actualizar el estado del paquete: ", error);
      setMessage(`Error al actualizar el paquete ${packageId}`); // Mensaje de error
    }
  };

>>>>>>> chino:bergamotaroutes/src/components/map/map.tsx
  return (
    <>
      {/* Contenedor del mapa con dimensiones específicas. */}
      <div id="map" style={{ height: "500px", width: "100%" }} />
      {/* Renderiza el marcador de ubicación del usuario si está disponible. */}
=======
  const handleRouteClick = (index: number) => {
    if (index === currentRouteIndex) {
      setClickedRoutes((prev) => new Set(prev).add(index));
      setCurrentRouteIndex(index === sortedMarkers.length - 1 ? 0 : index + 1);
      swiperRef.current?.slideTo(index + 1); // Cambiar el slide automáticamente
    }
  };

  // Función para centrar el mapa en la ubicación del usuario
  const zoomToUserLocation = () => {
    if (userLocationRef.current && mapRef.current) {
      mapRef.current.setView(userLocationRef.current, 18); // Zoom máximo
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const today = new Date();
    const dateKey = today.toISOString().split("T")[0]; // Obtiene la fecha en formato YYYY-MM-DD
    const docRef = doc(db, "issues", dateKey);
    const description = (e.target as any).elements[0].value;

    console.log("Intentando acceder a:", docRef.path); // Agregar este log

    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Documento existente encontrado. Actualizando...");
        await updateDoc(docRef, {
          updatedAt: new Date().toISOString(),
          description,
        });
        console.log("Reporte actualizado");
      } else {
        console.log("Documento no encontrado. Creando uno nuevo...");
        await setDoc(docRef, {
          createdAt: new Date().toISOString(),
          description,
        });
        console.log("Reporte creado");
      }
      setReportVisible(false); // Cierra el formulario después de enviar
    } catch (error) {
      console.error("Error al enviar el reporte:", error);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 h-screen z-50">
          <DisplayLoader />
        </div>
      )}
      <div id="map" className="h-screen w-full relative z-0" />
>>>>>>> origin
      {userLocationRef.current && (
        <LocationMarker
          userLocation={userLocationRef.current}
          map={mapRef.current!}
        />
      )}
<<<<<<< HEAD
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
                className="bg-white border border-black-main rounded items-center justify-between gap-4 p-4"
              >
                {marker.label}: {marker.distance.toFixed(2)} km
              </li>
            ))}
          </ul>
        </div>
      )}
      <table className="min-w-full border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ID del Paquete</th>
            <th className="border border-gray-300 p-2">Ubicación</th>
            <th className="border border-gray-300 p-2">Estado</th>
            <th className="border border-gray-300 p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr key={pkg.id}>
              <td className="border border-gray-300 p-2">{pkg.id}</td>
              <td className="border border-gray-300 p-2">
                {pkg.location ? `Lat: ${pkg.location.lat}, Lng: ${pkg.location.lng}` : "Ubicación no disponible"}
              </td>
              <td className="border border-gray-300 p-2">{pkg.status}</td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => updatePackageStatus(pkg.id, pkg.status)}
                  className="mt-2 p-1 bg-blue-500 text-white rounded"
                >
                  Actualizar Estado
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {message && <div className="mt-4 text-red-500">{message}</div>}
=======

      {/* Componente de lista de marcadores en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 z-10 mb-4 p-4 bg-opacity-80 rounded-t-lg">
        {sortedMarkers.length > 0 && (
          <div className="block sm:hidden">
            <Swiper
              slidesPerView={1}
              spaceBetween={10}
              navigation
              pagination={{ clickable: true }}
              className="swiper-container py-6"
              onSwiper={(swiper) => (swiperRef.current = swiper)}
            >
              {sortedMarkers.map((marker, index) => (
                <SwiperSlide
                  key={marker.label}
                  onClick={() => handleRouteClick(index)}
                >
                  <li
                    className={`relative group inline-block p-px font-semibold leading-6 shadow-2xl cursor-pointer rounded-xl transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95
                    ${
                      currentRouteIndex === index
                        ? "text-yellow-400"
                        : clickedRoutes.has(index)
                        ? "text-gray-500"
                        : "text-white"
                    }
                    ${
                      index !== currentRouteIndex
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  `}
                  >
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                    <span className="relative z-10 block px-4 py-2 rounded-xl bg-gray-950">
                      <div className="relative z-10 flex items-center space-x-2 text-sm sm:text-base">
                        <span className="transition-all duration-500 group-hover:translate-x-1">
                          {marker.label}: {marker.distance.toFixed(2)} km
                        </span>
                      </div>
                    </span>
                  </li>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <ul className="hidden sm:flex flex-wrap items-center justify-center gap-4 py-6">
          {sortedMarkers.map((marker, index) => (
            <li
              key={marker.label}
              onClick={() => handleRouteClick(index)}
              className={`relative group inline-block p-px font-semibold leading-6 shadow-2xl cursor-pointer rounded-xl transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95
              ${
                currentRouteIndex === index
                  ? "text-yellow-400"
                  : clickedRoutes.has(index)
                  ? "text-gray-500"
                  : "text-white"
              }
              ${
                index !== currentRouteIndex
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            `}
            >
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
              <span className="relative z-10 block px-4 py-2 rounded-xl bg-gray-950">
                <div className="relative z-10 flex items-center space-x-2 text-sm sm:text-base">
                  <span className="transition-all duration-500 group-hover:translate-x-1">
                    {marker.label}: {marker.distance.toFixed(2)} km
                  </span>
                </div>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Botones de navegación en la esquina superior derecha */}
      <div className="absolute top-4 right-4 z-20 space-y-4">
        <div className="flex items-center gap-5">
          <div>
            {/* Icono de Ubicacion */}
            <button onClick={zoomToUserLocation}>
              <div className="loader mr-4"></div>
            </button>
          </div>
          {/* Botón para abrir el formulario de reporte */}
          <div>
            <button
              onClick={() => setReportVisible(!reportVisible)}
              className="relative group inline-block p-px font-semibold leading-6 text-white shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
            >
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
              <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
                Reportar
              </span>
            </button>
          </div>
          <div>
            {/* Botón de regresar */}
            <Link
              href="/"
              className="relative group inline-block p-px font-semibold leading-6 text-white shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
            >
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
              <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
                Regresar
              </span>
            </Link>
          </div>
        </div>

        {/* Formulario de reporte */}
        {reportVisible && (
          <div className="absolute top-16 right-4 bg-white p-4 shadow-lg rounded-lg z-20">
            <form onSubmit={handleReportSubmit}>
              <h3 className="font-bold mb-2 text-center">Reporte</h3>
              <label>Descripcion de tu problema</label>
              <textarea
                rows={4}
                className="w-full border border-gray-300 p-2 rounded-lg mb-2"
                placeholder="Escribe tu reporte aquí..."
              ></textarea>
              <div className="flex gap-5">
                <button
                  type="submit"
                  className="bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-hover"
                >
                  Enviar
                </button>
                <button
                  type="button"
                  onClick={() => setReportVisible(false)}
                  className="bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-hover"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Componente de lista de marcadores en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 z-10 mb-4 p-4 bg-opacity-80 rounded-t-xl">
        <Swiper
          ref={swiperRef}
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
        >
          {sortedMarkers.map((marker, index) => (
            <SwiperSlide key={index} onClick={() => handleRouteClick(index)}>
              <OtherMarkers
                lat={marker.lat}
                lng={marker.lng}
                label={marker.label}
                distance={marker.distance}
                isClicked={clickedRoutes.has(index)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <OtherMarkers markers={sortedMarkers} map={mapRef.current} />
>>>>>>> origin
    </>
  );
};

<<<<<<< HEAD
// Exporta el componente para que pueda ser utilizado en otras partes de la aplicación.
=======
>>>>>>> origin
export default MapComponent;

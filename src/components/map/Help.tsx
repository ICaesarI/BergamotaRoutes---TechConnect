import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import Link from "next/link"; // Importar Link
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteField,
  arrayUnion,
} from "firebase/firestore"; // Asegúrate de que getDocs esté incluido
import { db, auth } from "@techconnect /src/database/firebaseConfiguration";
import { optimizeRoute } from "./RouteOptimizer";
import { fetchRouteFromORS } from "./RouteService";
import LocationMarker from "./LocationMarker";
import OtherMarkers from "./OtherMarkers";
import DisplayLoader from "../loader";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRouter } from "next/navigation";

interface MarkerData {
  lat: number;
  lng: number;
  label: string;
  number: string;
  statusDriver: string;
  distance: number;
}

const MapComponent: React.FC<{ routeCode: string }> = ({ routeCode }) => {
  const mapRef = useRef<L.Map | null>(null);
  const userLocationRef = useRef<L.LatLng | null>(null);
  const [sortedMarkers, setSortedMarkers] = useState<
    { lat: number; lng: number; label: string; distance: number }[]
  >([]);
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
  const [clickedRoutes, setClickedRoutes] = useState<Set<number>>(new Set());
  const [reportVisible, setReportVisible] = useState(false); // Estado para el formulario
  const [loading, setLoading] = useState(true); // Estado para el loading
  const swiperRef = useRef<Swiper | null>(null); // Referencia para controlar Swiper
  const router = useRouter();
  const [driverUid, setDriverUid] = useState<string>(""); // UID del conductor

  const [activeMarker, setActiveMarker] = useState<number | null>(null);

  const fetchMarkersFromFirestore = async () => {
    const docRef = doc(db, "tracking", routeCode);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Obteniendo datos del seguimiento:", data);
      const markers: MarkerData[] = [];

      // Obtener los documentos de la colección 'packages'
      const packagesRef = collection(db, "tracking", routeCode, "packages");
      const querySnapshot = await getDocs(packagesRef);

      querySnapshot.forEach((doc) => {
        const packageData = doc.data();
        const { address, location, statusDriver, uidPackage } = packageData;

        // Filtrar paquetes con statusDriver en "Entregado"
        if (
          address &&
          location &&
          location.latitude !== undefined &&
          location.longitude !== undefined &&
          statusDriver !== "Entregado" // Excluir los paquetes entregados
        ) {
          const lat = location.latitude;
          const lng = location.longitude;
          markers.push({
            id: uidPackage, // Asigna el UID del paquete como ID
            lat,
            lng,
            label: address,
            number: uidPackage,
            status: statusDriver === "Activo" ? "Activo" : "Inactivo",
            distance: 0,
          });
        }
      });

      return markers;
    }
    console.log("No se encontró el documento de seguimiento");
    return [];
  };

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setDriverUid(currentUser.uid);
    } else {
      console.log("No hay usuario autenticado");
      setDriverUid("");
    }

    const initializeMap = async () => {
      if (!mapRef.current) {
        mapRef.current = L.map("map", {
          center: [20.639, -103.312], // Coordenadas iniciales
          zoom: 10,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);
      }

      // Obtener ubicación del usuario
      const userLocation = await new Promise<L.LatLng>((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              resolve(L.latLng(latitude, longitude));
            },
            (error) => reject(error)
          );
        } else {
          reject(new Error("Geolocation not supported"));
        }
      });
      userLocationRef.current = userLocation;

      const markers = await fetchMarkersFromFirestore();
      console.log("Datos obtenidos de Firestore:", markers); // Verifica la estructura de los datos

      const distances = markers.map((marker) => ({
        ...marker,
        distance:
          userLocation.distanceTo(L.latLng(marker.lat, marker.lng)) / 1000,
      }));

      const optimizedRoute = optimizeRoute(userLocation, distances);
      console.log("Ruta optimizada:", optimizedRoute);

      // Filtrar los marcadores excluyendo aquellos que ya fueron "Entregado" en statusDriver
      const filteredMarkers = optimizedRoute.filter((marker) => {
        console.log(
          `Marcador ${marker.label} con statusDriver: ${marker.statusDriver}, statusPackage: ${marker.statusPackage}`
        );

        // Verificación para asegurar que los datos existan y están completos
        if (
          marker.statusDriver === undefined ||
          marker.statusPackage === undefined
        ) {
          console.warn(
            `Marcador con datos faltantes: ${JSON.stringify(marker)}`
          );
        }

        // Aquí filtras los marcadores para que solo queden los que no están "Entregado"
        return marker.statusDriver !== "Entregado";
      });

      console.log(
        "Marcadores después del filtrado (excluyendo 'Entregado' en statusDriver):",
        filteredMarkers
      );

      setSortedMarkers(filteredMarkers); // Actualizar el estado con los marcadores filtrados

      // Obtener y dibujar la ruta optimizada
      const routeCoordinates = await fetchRouteFromORS(
        userLocation,
        filteredMarkers
      );
      if (routeCoordinates.length > 0) {
        L.polyline(routeCoordinates, { color: "blue", weight: 4 }).addTo(
          mapRef.current!
        );
      }

      setLoading(false);
    };

    initializeMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [routeCode]);

  // Manejar el clic en la ruta
  const handleRouteClick = (nextIndex: number) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      try {
        swiperRef.current.swiper.slideTo(nextIndex);
      } catch (error) {
        console.error("Error al actualizar el estado del marcador:", error);
        console.error(
          "Error Details:",
          error instanceof Error ? error.message : error
        );
      }
    } else {
      console.error("Swiper ref no está disponible o no está inicializado.");
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

    console.log("Intentando acceder a:", docRef.path);

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

  // Función para manejar el clic en el marcador
  const handleMarkerClick = (index: number) => {
    setActiveMarker((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleEntregadoClick = async (index: number) => {
    if (index === currentRouteIndex) {
      const marker = sortedMarkers[index];
      const markerId = marker.id;

      if (!markerId) {
        console.error("No se encontró el ID del marcador.");
        return;
      }

      console.log("Entregando marcador:", marker);

      const markerRef = doc(db, "tracking", routeCode, "packages", markerId);
      const trackingRef = doc(db, "tracking", routeCode);
      try {
        await updateDoc(markerRef, {
          statusDriver: "Entregado",
        });

        setSortedMarkers((prevMarkers) => {
          const updatedMarkers = prevMarkers.map((m, i) =>
            i === index ? { ...m, statusDriver: "Entregado" } : m
          );
          return updatedMarkers;
        });

        // Verifica si es el último marcador
        if (index === sortedMarkers.length - 1) {
          // Mueve el UID de la ruta actual a finishedRoutes y elimina actualRoute
          const driverRef = doc(
            db,
            "drivers",
            driverUid,
            "routes",
            "actualRoute"
          );
          const finishedRoutesRef = doc(
            db,
            "drivers",
            driverUid,
            "routes",
            "finishedRoutes"
          );

          await updateDoc(driverRef, {
            routeUID: deleteField(), // Elimina el UID de la ruta de actualRoute
          });

          await updateDoc(finishedRoutesRef, {
            routes: arrayUnion(routeCode), // Mueve el UID de la ruta a finishedRoutes
          });

          await updateDoc(trackingRef, {
            statusTracking: "Finished",
          });

          // Redirige a /tracking si es el último marcador
          router.push("/tracking");
        } else {
          // Cambia al siguiente marcador en la lista
          const nextIndex = index + 1;
          setCurrentRouteIndex(nextIndex);

          if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideTo(nextIndex);
          }
        }
      } catch (error) {
        console.error("Error al actualizar el estado del marcador:", error);
      }
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
      {userLocationRef.current && (
        <LocationMarker
          userLocation={userLocationRef.current}
          map={mapRef.current!}
        />
      )}

      {/* Componente de lista de marcadores en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 z-10 mb-4 p-4 bg-opacity-80 rounded-t-lg bg-gray-800">
        {/* Mobile View: Swiper Slider */}
        {sortedMarkers.length > 0 && (
          <div className="block sm:hidden">
            <Swiper
              slidesPerView={1}
              spaceBetween={10}
              navigation
              pagination={{ clickable: true }}
              className="swiper-container py-6"
            >
              {sortedMarkers.map((marker, index) => (
                <SwiperSlide key={marker.label}>
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
                    onClick={() => setActiveMarker(index)}
                  >
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                    <span className="relative z-10 block px-4 py-2 rounded-xl bg-gray-950">
                      <div className="relative z-10 flex items-center space-x-2 text-sm sm:text-base">
                        <span className="transition-all duration-500 group-hover:translate-x-1">
                          {marker.label}: {marker.distance.toFixed(2)} km
                        </span>
                      </div>
                    </span>

                    {/* Botones de acción cuando el marcador está activo */}
                    {activeMarker === index && (
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md p-2">
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
                          onClick={() => {
                            mapRef.current?.setView(
                              [marker.lat, marker.lng],
                              16
                            );
                          }}
                        >
                          Ver Ubicación
                        </button>
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded"
                          onClick={() => handleEntregadoClick(index)}
                        >
                          Entregado
                        </button>
                      </div>
                    )}
                  </li>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* Desktop View: List of Markers */}
        <ul className="hidden sm:flex flex-wrap items-center justify-center gap-4 py-6">
          {sortedMarkers.map((marker, index) => (
            <li
              key={marker.label}
              onClick={() => setActiveMarker(index)}
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

              {/* Botones de acción cuando el marcador está activo */}
              {activeMarker === index && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md p-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
                    onClick={() => {
                      mapRef.current?.setView([marker.lat, marker.lng], 16);
                    }}
                  >
                    Ver Ubicación
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => handleEntregadoClick(index)}
                  >
                    Entregado
                  </button>
                </div>
              )}
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
              href="/tracking"
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
    </>
  );
};

export default MapComponent;

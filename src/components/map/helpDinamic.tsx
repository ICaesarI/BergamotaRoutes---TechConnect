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
} from "firebase/firestore"; // Asegúrate de que getDocs esté incluido
import { db } from "@techconnect /src/database/firebaseConfiguration";
import { optimizeRoute } from "./RouteOptimizer";
import { fetchRouteFromORS } from "./RouteService";
import LocationMarker from "./LocationMarker";
import OtherMarkers from "./OtherMarkers";
import DisplayLoader from "../loader";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface MarkerData {
  lat: number;
  lng: number;
  label: string;
  number: string;
  status: string;
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
  const swiperRef = useRef<any>(null); // Referencia para controlar Swiper

  const fetchMarkersFromFirestore = async () => {
    const docRef = doc(db, "tracking", routeCode);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const markers: MarkerData[] = [];

      // Recorrer sub-objetos del 1 al 10 y extraer información
      for (let i = 1; i <= 10; i++) {
        const item = data[i];
        if (item) {
          const { address, location, number, status } = item;
          markers.push({
            lat: location._lat,
            lng: location._long,
            label: address,
            number: number,
            status: status ? "Activo" : "Inactivo",
            distance: 0, // Se calculará después
          });
        }
      }
      return markers;
    }
    return [];
  };

  useEffect(() => {
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

      // Obtener ubicación del usuario y los marcadores
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
      const distances = markers.map((marker) => ({
        ...marker,
        distance:
          userLocation.distanceTo(L.latLng(marker.lat, marker.lng)) / 1000,
      }));
      const optimizedRoute = optimizeRoute(userLocation, distances);
      setSortedMarkers(optimizedRoute);

      // Obtener y dibujar la ruta optimizada
      const routeCoordinates = await fetchRouteFromORS(
        userLocation,
        optimizedRoute
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
      {userLocationRef.current && (
        <LocationMarker
          userLocation={userLocationRef.current}
          map={mapRef.current!}
        />
      )}

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
    </>
  );
};

export default MapComponent;

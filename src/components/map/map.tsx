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
    {
      lat: 20.62305742861593,
      lng: -103.06885345787988,
      label: "Zapotlanejo Centro",
    },
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
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

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
                console.error("Error obteniendo la ubicación:", error);
                reject(error);
              }
            );
          } else {
            alert("La geolocalización no es soportada por este navegador.");
            reject(new Error("Geolocation not supported"));
          }
        });

        userLocationRef.current = userLocation;

        const distances = otherMarkersData.map(({ lat, lng, label }) => {
          const markerLocation = L.latLng(lat, lng);
          const distance =
            userLocationRef.current?.distanceTo(markerLocation) || 0;
          return { lat, lng, label, distance: distance / 1000 };
        });

        const optimizedRoute = optimizeRoute(
          userLocationRef.current,
          distances
        );
        setSortedMarkers(optimizedRoute);

        const routeCoordinates = await fetchRouteFromORS(
          userLocationRef.current,
          optimizedRoute
        );
        if (mapRef.current && routeCoordinates.length > 0) {
          L.polyline(routeCoordinates, { color: "blue", weight: 4 }).addTo(
            mapRef.current
          );
        }
      } catch (error) {
        console.error(
          "Error en la obtención de la ubicación o marcadores:",
          error
        );
      } finally {
        setLoading(false); // Ocultar el loading al finalizar
      }
    };

    fetchLocationAndMarkers();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

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

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
<<<<<<< HEAD
import LocationMarker from "./LocationMarker";
import OtherMarkers from "./OtherMarkers";
import { optimizeRoute } from "./RouteOptimizer";
import { fetchRouteFromORS } from "./RouteService";

interface MapComponentProps {
  otherMarkersData?: { lat: number; lng: number; label: string }[]; // Otros marcadores
}

const MapComponent: React.FC<MapComponentProps> = ({ otherMarkersData }) => {
  const mapRef = useRef<L.Map | null>(null);
  const userLocationRef = useRef<L.LatLng | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [sortedMarkers, setSortedMarkers] = useState<
    { lat: number; lng: number; label: string; distance: number }[]
  >([]);

  useEffect(() => {
    // Obtener la ubicación actual del usuario
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error al obtener la ubicación:", error);
        // Establecer una ubicación predeterminada en caso de error
        setUserLocation({ lat: -34.617, lng: -58.383 });
      }
    );
  }, []);

  useEffect(() => {
    if (!mapRef.current && userLocation) {
      mapRef.current = L.map("map").setView(
        [userLocation.lat, userLocation.lng],
        13
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    const fetchMarkers = async () => {
      if (!userLocation) return;

      try {
        userLocationRef.current = L.latLng(userLocation.lat, userLocation.lng);

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

        // Solicitar la ruta a OpenRouteService
        const routeCoordinates = await fetchRouteFromORS(
          userLocationRef.current,
          optimizedRoute
        );

        // Dibujar la ruta en el mapa
        if (mapRef.current && routeCoordinates.length > 0) {
          L.polyline(routeCoordinates, { color: "blue", weight: 4 }).addTo(
            mapRef.current
          );
        }
      } catch (error) {
        console.error("Error en la obtención de los marcadores:", error);
      }
    };

    fetchMarkers();
=======
import { doc, getDoc } from "firebase/firestore";
import { db } from "@techconnect /src/database/firebaseConfiguration";
import { optimizeRoute } from "./RouteOptimizer";
import { fetchRouteFromORS } from "./RouteService";
import LocationMarker from "./LocationMarker";
import OtherMarkers from "./OtherMarkers";
import DisplayLoader from "../loader";
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
  const [sortedMarkers, setSortedMarkers] = useState<MarkerData[]>([]);
  const [loading, setLoading] = useState(true);

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
>>>>>>> origin

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
<<<<<<< HEAD
  }, [userLocation, otherMarkersData]); // Dependencias del useEffect

  return (
    <>
      <div id="map" style={{ height: "500px", width: "100%" }} />
=======
  }, [routeCode]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 h-screen z-50">
          <DisplayLoader />
        </div>
      )}
      <div id="map" className="h-screen w-full relative z-0" />
      <OtherMarkers markers={sortedMarkers} map={mapRef.current} />
>>>>>>> origin
      {userLocationRef.current && (
        <LocationMarker
          userLocation={userLocationRef.current}
          map={mapRef.current!}
        />
      )}
<<<<<<< HEAD
      <OtherMarkers markers={otherMarkersData} map={mapRef.current!} />
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
=======
>>>>>>> origin
    </>
  );
};

export default MapComponent;

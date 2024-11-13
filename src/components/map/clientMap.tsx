import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
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
  

  //Ubicacion del Driver de la base de datos
  

  //Ubicacion del cliente de la base de datos


//   const fetchMarkersFromFirestore = async () => {
//     const docRef = doc(db, "paquetesPruebas", routeCode);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       const data = docSnap.data();
//       console.log("Obteniendo datos del seguimiento:", data);
//       const markers: MarkerData[] = [];

//       // Obtener los documentos de la colección 'packages'
//       const packagesRef = collection(db, "tracking", routeCode  ,"packages");
//       const querySnapshot = await getDocs(packagesRef);

//       querySnapshot.forEach((doc) => {
//         const packageData = doc.data();
//         const { address, location, statusDriver, uidPackage } = packageData;

//         if (
//           address &&
//           location &&
//           location.latitude !== undefined &&
//           location.longitude !== undefined
//         ) {
//           const lat = location.latitude;
//           const lng = location.longitude;
//           console.log("Obteniendo datos del paquete:", lat + " " + lng);
//           markers.push({
//             lat,
//             lng,
//             label: address,
//             number: uidPackage,
//             status: statusDriver === "Activo" ? "Activo" : "Inactivo", // Ajuste basado en el texto del estado
//             distance: 0, // Se calculará después si es necesario
//           });
//         }
//       });

//       return markers;
//     }
//     console.log("No se encontró el documento de seguimiento");
//     return [];
//   };

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
      console.log("Datos obtenidos de Firestore:", markers); // Verifica la estructura de los datos
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
  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 h-screen z-50">
          <DisplayLoader />
        </div>
      )}
      <div id="map" className="h-screen w-full relative z-0" />
      <OtherMarkers markers={sortedMarkers} map={mapRef.current} />
      {userLocationRef.current && (
        <LocationMarker
          userLocation={userLocationRef.current}
          map={mapRef.current!}
        />
      )}
    </>
  );
};

export default MapComponent;

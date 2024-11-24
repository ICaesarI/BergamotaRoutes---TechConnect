import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@techconnect /src/database/firebaseConfiguration";
import { optimizeRoute } from "./RouteOptimizer";
import { fetchRouteFromORS } from "./RouteService";
import LocationMarker from "./LocationMarker";
import OtherMarkers from "./OtherMarkers";
import DisplayLoader from "../loader";

interface MarkerData {
  lat: number;
  lng: number;
  label: string;
  number: string;
  status: string;
  distance: number;
}

const MapComponent: React.FC<{ trackingCode: string }> = ({ trackingCode }) => {
  console.log("Tracking Code recibido:", trackingCode);
  const mapRef = useRef<L.Map | null>(null);
  const userLocationRef = useRef<L.LatLng | null>(null);  // Ubicación del paquete
  const driverLocationRef = useRef<L.LatLng | null>(null);  // Ubicación del conductor
  const [sortedMarkers, setSortedMarkers] = useState<MarkerData[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener la ubicación del conductor
  const fetchDriverLocation = async (driverUID: string) => {
    try {
      const idRef = doc(db, "drivers", driverUID, "routes", "actualRoute");
      const idDoc = await getDoc(idRef);

      if (!idDoc.exists()) {
        console.error("No se encontró el documento de la ruta del conductor.");
        return null;
      }

      const idData = idDoc.data();
      const driverLocation = idData?.userLocation;

      if (!driverLocation) {
        console.error("No se encontró la ubicación del conductor.");
        return null;
      }

      console.log("Ubicación del conductor:", driverLocation);
      return {
        location: L.latLng(driverLocation.latitude, driverLocation.longitude),
        label: "Driver",
      };
    } catch (error) {
      console.error("Error obteniendo la ubicación del conductor:", error);
      return null;
    }
  };

  const findRouteByTrackingCode = async (trackingCode: string) => {
    try {
      const trackingRef = collection(db, "tracking");
      const routesSnapshot = await getDocs(trackingRef);

      for (const routeDoc of routesSnapshot.docs) {
        const routeId = routeDoc.id;
        const packageRef = doc(db, "tracking", routeId, "packages", trackingCode);
        const packageDoc = await getDoc(packageRef);

        if (packageDoc.exists()) {
          console.log(`Ruta encontrada: ${routeId}`);
          return routeId;
        }
      }

      console.log("No se encontró una ruta para el código de seguimiento.");
      return null;
    } catch (error) {
      console.error("Error buscando la ruta:", error);
      return null;
    }
  };

  const fetchPackageLocation = async (trackingCode: string) => {
    try {
      const foundRouteCode = await findRouteByTrackingCode(trackingCode);
      if (!foundRouteCode) {
        console.error("No se encontró la ruta para el cliente.");
        return [];
      }

      const routeRef = doc(db, "tracking", foundRouteCode);
      const routeDoc = await getDoc(routeRef);

      if (!routeDoc.exists()) {
        console.error("No se encontró el documento de la ruta.");
        return [];
      }

      const routeData = routeDoc.data();
      const driverUID = routeData?.driverUID;

      if (!driverUID) {
        console.error("No se encontró el ID del conductor en la ruta.");
        return [];
      }

      console.log("ID del conductor:", driverUID);

      // Obtener la ubicación del conductor
      const driverLocation = await fetchDriverLocation(driverUID);
      if (!driverLocation) {
        return [];
      }

      driverLocationRef.current = driverLocation.location;

      const packageRef = doc(db, "tracking", foundRouteCode, "packages", trackingCode);
      const packageDoc = await getDoc(packageRef);

      if (!packageDoc.exists()) {
        console.error("No se encontró el documento del paquete.");
        return [];
      }

      const packageData = packageDoc.data();
      const { location, address, uidPackage } = packageData;

      if (!location || location.latitude === undefined || location.longitude === undefined) {
        console.error("Los datos del paquete no tienen coordenadas válidas.");
        return [];
      }

      userLocationRef.current = L.latLng(location.latitude, location.longitude);
      console.log('Ubicacion del paquete ' + userLocationRef.current)
      return [
        {
          lat: driverLocation.location.lat,
          lng: driverLocation.location.lng,
          label: driverLocation.label || "Driver",
          number: driverUID || "",
          status: "Conductor",
        },
      ];
    } catch (error) {
      console.error("Error obteniendo la ubicación del paquete:", error);
      return [];
    }
  };

  useEffect(() => {
    const initializeMapWithRoute = async () => {
      try {
        const markers = await fetchPackageLocation(trackingCode);
  
        if (!markers || markers.length === 0) {
          console.error("No se encontraron marcadores");
          setLoading(false);
          return;
        }
  
        // Asumimos que siempre habrá dos marcadores: paquete y conductor
        const distances = markers.map((marker) => ({
          ...marker,
          distance: userLocationRef.current?.distanceTo(L.latLng(marker.lat, marker.lng)) / 1000,
        }));
        const optimizedRoute = optimizeRoute(userLocationRef.current, distances);
        setSortedMarkers(optimizedRoute);
  
        // Obtener las coordenadas de la ruta desde ORS
        const routeCoordinates = await fetchRouteFromORS(
          userLocationRef.current,
          optimizedRoute
        );
  
        if (routeCoordinates.length > 0) {
          L.polyline(routeCoordinates, { color: "blue", weight: 4 }).addTo(mapRef.current!);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error inicializando el mapa con la ruta:", error);
        setLoading(false);
      }
    };

    if (!mapRef.current) {
      const map = L.map("map").setView([20.639, -103.312], 10);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
      mapRef.current = map;
    }

    // Ejecutar la actualización cada 30 segundos
    const intervalId = setInterval(() => {
      // Primero, limpiamos el mapa
      mapRef.current?.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          mapRef.current?.removeLayer(layer);
        }
      });

      // Luego, volvemos a inicializar el mapa con la nueva ubicación
      initializeMapWithRoute();
    }, 10000); // 30000 milisegundos = 30 segundos

    // Llamar a la función una vez al inicio
    initializeMapWithRoute();

    // Limpiar el intervalo cuando el componente se desmonte
    return () => {
      clearInterval(intervalId);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [trackingCode]);

  return (
    <>
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

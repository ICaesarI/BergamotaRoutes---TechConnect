import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import LocationMarker from "./LocationMarker";
import OtherMarkers from "./OtherMarkers";
import { optimizeRoute } from "./RouteOptimizer";
import { fetchRouteFromORS } from "./RouteService";
import { db } from "@techconnect /src/database/firebaseConfiguration"; // Asegúrate de que la ruta sea correcta
import { addDoc, collection, updateDoc, doc, getDocs } from "firebase/firestore";

const MapComponent: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const userLocationRef = useRef<L.LatLng | null>(null);
  const [sortedMarkers, setSortedMarkers] = useState<
    { lat: number; lng: number; label: string; distance: number }[]
  >([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  
  const otherMarkersData = useRef([
    { lat: 20.655152217635692, lng: -103.32543897713083, label: "CUCEI" },
    { lat: 20.651166606563386, lng: -103.31960249016042, label: "La Vid Restaurant" },
    { lat: 20.649670720513537, lng: -103.30730724417981, label: "McDonald's" },
    { lat: 20.62305742861593, lng: -103.06885345787988, label: "Zapotlanejo Centro" }
  ]).current;

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([-34.617, -58.383], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
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
        console.error("Error en la obtención de la ubicación o marcadores:", error);
      }
    };

    fetchLocationAndMarkers();

    // Fetch packages from Firestore
    const fetchPackages = async () => {
      const querySnapshot = await getDocs(collection(db, "packages"));
      const packagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPackages(packagesData);
    };

    fetchPackages();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

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

  return (
    <>
      <div id="map" style={{ height: "500px", width: "100%" }} />
      {userLocationRef.current && (
        <LocationMarker
          userLocation={userLocationRef.current}
          map={mapRef.current!}
        />
      )}
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
    </>
  );
};

export default MapComponent;

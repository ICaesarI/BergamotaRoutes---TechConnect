import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
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

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [userLocation, otherMarkersData]); // Dependencias del useEffect

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
    </>
  );
};

export default MapComponent;

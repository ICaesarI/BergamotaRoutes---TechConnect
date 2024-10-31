import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import LocationMarker from "./LocationMarker";
import OtherMarkers from "./OtherMarkers";
import { optimizeRoute } from "./RouteOptimizer";
import { fetchRouteFromORS } from "./RouteService";

const MapComponent: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const userLocationRef = useRef<L.LatLng | null>(null);
  const [sortedMarkers, setSortedMarkers] = useState<
    { lat: number; lng: number; label: string; distance: number }[]
  >([]);

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
    }
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

        console.log("Start Location:", userLocationRef.current);
        console.log("Waypoints:", optimizedRoute);

        // Solicitar la ruta a OpenRouteService
        const routeCoordinates = await fetchRouteFromORS(
          userLocationRef.current,
          optimizedRoute
        );

        console.log("Route Coordinates:", routeCoordinates);

        // Dibujar la ruta en el mapa
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

export default MapComponent;

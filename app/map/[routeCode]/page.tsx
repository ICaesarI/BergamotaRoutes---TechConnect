"use client";

import { useEffect } from "react";
import { use } from "react";
import MapComponent from "@techconnect /src/components/map/map";

interface MapPageProps {
  params: Promise<{ routeCode: string }>;
}

export default function Map({ params }: MapPageProps) {
  const { routeCode } = use(params);

  return (
    <div className="min-h-screen h-screen">
      <div className="h-full w-full">
        {/* Pasamos el routeCode al componente MapComponent */}
        <MapComponent routeCode={routeCode} />
      </div>
    </div>
  );
}

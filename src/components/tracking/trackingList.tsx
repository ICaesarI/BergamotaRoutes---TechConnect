import React from "react";

const TrackingList = ({ trackingData }: { trackingData: any[] }) => {
  const getStatusStyles = (statusDriver: string) => {
    switch (statusDriver) {
      case "Entregado":
        return "bg-green-100 dark:bg-green-900 border-l-4 border-green-500 dark:border-green-700 text-green-900 dark:text-green-100";
      case "En espera":
        return "bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100";
      case "Cancelado":
        return "bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700 text-red-900 dark:text-red-100";
      default:
        return "bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500 dark:border-blue-700 text-blue-900 dark:text-blue-100";
    }
  };

  return (
    <ul
      className={`space-y-2 p-4 list-disc pl-5 ${
        trackingData.length > 3 ? "max-h-60 overflow-y-auto" : ""
      }`}
    >
      {trackingData.map((data, index) => (
        <li
          key={index}
          className={`p-2 rounded-lg flex items-start ${getStatusStyles(
            data.statusDriver
          )}`}
        >
          <div className="flex-shrink-0 mr-2">
            <svg
              stroke="currentColor"
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 text-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold mb-1">
              {data.statusDriver === "Entregado"
                ? "Success - Entregado"
                : data.statusDriver === "En espera"
                ? "Warning - En espera"
                : data.statusDriver === "Cancelado"
                ? "Error - Cancelado"
                : "Info - Sin estado específico"}
            </p>
            <strong>Dirección:</strong> {data.address} <br />
            <strong>Ubicación:</strong> {data.location._lat}° N,{" "}
            {data.location._long}° W <br />
            <strong>ID:</strong> {data.uidPackage} <br />
            <strong>Estado:</strong> {data.statusDriver} <br />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TrackingList;

"use client";
import { useState } from "react";
import { useAuth } from "@techconnect /src/auth/useAuth";
import { db } from "@techconnect /src/database/firebaseConfiguration";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import MapComponent from "@techconnect /src/components/map/map";

export default function Map() {
  const { user } = useAuth();
  const [showReport, setShowReport] = useState(false);
  const [reportDescription, setReportDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportSent, setReportSent] = useState(false); // Estado para determinar si el reporte fue enviado

  const handleOpenReport = () => {
    setShowReport(true);
    setReportSent(false); // Reinicia el estado del reporte enviado cuando se abre el modal
  };

  const handleCloseReport = () => {
    setShowReport(false);
    setReportDescription(""); // Limpia el formulario
    setReportSent(false); // Restablece el estado del reporte enviado
  };

  const handleSubmitReport = async () => {
    if (!reportDescription.trim()) {
      alert("Por favor, escribe una descripción para el reporte.");
      return;
    }

    setLoading(true);
    if (user) {
      try {
        const reportRef = doc(db, "issue", `${user.uid}_${Date.now()}`);
        await setDoc(reportRef, {
          userId: user.uid,
          description: reportDescription,
          createdAt: serverTimestamp(),
        });
        setReportSent(true); // Marca el reporte como enviado
        setReportDescription(""); // Limpia la descripción
      } catch (error) {
        console.error("Error al enviar el reporte:", error);
        alert("Hubo un error al enviar el reporte. Inténtalo de nuevo.");
      }
    } else {
      alert("Usuario no autenticado. Por favor, inicia sesión.");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Botón principal para abrir el modal */}
      <div className="absolute top-4 right-4 flex space-x-4 z-10">
        <button
          onClick={handleOpenReport}
          className="shadow-lg bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-700"
        >
          Reportar
        </button>
      </div>

      {/* Componente del mapa */}
      <div className="h-full">
        <MapComponent />
        {/* Modal de reporte */}
        {showReport && (
          <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 w-80 z-20">
            {reportSent ? (
              // Mensaje de confirmación de envío exitoso
              <div className="text-center">
                <h2 className="text-lg font-bold mb-2 text-gray-700">
                  Reporte enviado con éxito
                </h2>
                <p className="text-gray-600">
                  Esperamos darte una pronta solución.
                </p>
                <button
                  onClick={handleCloseReport}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              // Formulario de descripción
              <>
                <h2 className="text-lg font-bold mb-2 text-gray-700">
                  Reportar un fallo
                </h2>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Describe el fallo o problema..."
                  className="w-full h-24 border border-gray-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                ></textarea>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={handleCloseReport}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Regresar
                  </button>
                  <button
                    onClick={handleSubmitReport}
                    disabled={loading}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {loading ? "Enviando..." : "Enviar"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

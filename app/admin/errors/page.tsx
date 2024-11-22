"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@techconnect /src/database/firebaseConfiguration"; // Ajusta la ruta según tu proyecto

export default function ErrorReports() {
  const [errorReports, setErrorReports] = useState([]); // Estado para almacenar los reportes
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  useEffect(() => {
    // Función para obtener los reportes de errores desde Firebase
    const fetchErrorReports = async () => {
      try {
        const issuesQuery = query(
          collection(db, "issues"),
          orderBy("createdAt", "desc")
        );
        const issuesSnapshot = await getDocs(issuesQuery);
        const issuesList = issuesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setErrorReports(issuesList);
        setLoading(false); // Finalizar la carga
      } catch (error) {
        console.error("Error al cargar los reportes de errores:", error);
      }
    };

    fetchErrorReports();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Error Reports</h1>
      <div className="my-6 flex justify-center">
        <a
          href="/admin"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-300 transition"
        >
          Go back
        </a>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : errorReports.length === 0 ? (
        <p className="text-gray-500 text-center">No error reports found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {errorReports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-100">
                {/* Fecha del reporte */}
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {new Date(report.createdAt).toLocaleString()}
                </td>

                {/* Descripción del error */}
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {report.description}
                </td>

                {/* Estado del error */}
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {report.resolved ? (
                    <span className="bg-green-200 text-green-700 px-2 py-1 rounded-lg">
                      Resolved
                    </span>
                  ) : (
                    <span className="bg-red-200 text-red-700 px-2 py-1 rounded-lg">
                      Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

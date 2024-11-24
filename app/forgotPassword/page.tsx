"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Importar useRouter de Next.js
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@techconnect /src/database/firebaseConfiguration";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Usamos useRouter para la redirección

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(
        "Correo de recuperación enviado con éxito. Revisa tu bandeja de entrada."
      );
      setTimeout(() => {
        router.push("/Login"); // Redirige al login después de un tiempo
      }, 3000);
    } catch (error) {
      setError(
        "Hubo un problema al enviar el correo. Asegúrate de que el correo esté registrado."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Recuperar Contraseña
        </h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {success && (
          <div className="text-green-500 text-center mb-4">{success}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Introduce tu correo electrónico"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 bg-blue-600 text-white rounded-md ${
              loading ? "opacity-50" : ""
            }`}
          >
            {loading ? "Enviando..." : "Enviar correo de recuperación"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <span>¿Recuperaste tu cuenta? </span>
          <a href="/Login" className="text-blue-600 hover:underline">
            Inicia sesión
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

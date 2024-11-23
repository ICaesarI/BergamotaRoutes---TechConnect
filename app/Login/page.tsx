"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signInUser } from "@techconnect /src/components/signInUser";
import { useRouter } from "next/navigation";
import { db, auth } from "@techconnect /src/database/firebaseConfiguration"; // Ajusta la ruta según tu proyecto

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Cargar el email desde localStorage si existe
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Resetea errores previos

    try {
      // Autenticación de usuario
      const user = await signInUser(email, password);
      console.log("Inicio de sesión exitoso:", user);

      // Verifica si el usuario está en la tabla "request"
      const requestRef = doc(db, "request", user.uid);
      const requestDoc = await getDoc(requestRef);

      if (requestDoc.exists()) {
        setError("Your account has not yet been assigned by an administrator. Please wait for the authorization process to be completed.");
      }

      // Guardar el email si "Remember me" está marcado
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      router.push("/"); // Redirecciona a la página principal
    } catch (err: any) {
      if (err.message === "auth/user-in-request") {
        setError("El usuario no está autenticado.");
      } else if (
        err.message === "auth/wrong-password" ||
        err.message === "Firebase: Error (auth/invalid-credential)."
      ) {
        setError("Correo o contraseña incorrectos.");
      } else {
        setError("Error al iniciar sesión. Intenta nuevamente.");
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left section with the map */}
      <div className="flex-1 relative bg-gray-800">
        <div className="absolute inset-0 flex items-center justify-center text-white text-center">
          <h1 className="text-7xl font-bold">
            Your time is valuable. Optimize every kilometer with us.
          </h1>
        </div>
      </div>

      {/* Right section with the login form */}
      <div className="flex-1 bg-white p-8 flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-4">Log In</h2>
        <p className="text-sm text-gray-600 mb-6">
          Welcome! Optimize your journeys, save time, and always reach your
          destination efficiently.
        </p>

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 p-4 border border-gray-300 rounded-lg w-full"
              placeholder="example@domain.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 p-4 border border-gray-300 rounded-lg w-full"
              placeholder="********"
            />
          </div>

          {/* Display error messages if any */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="flex items-center justify-between mt-4">
            <div>
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="remember" className="text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <Link
              href="/forgotPassword"
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white p-4 rounded-lg hover:bg-blue-hover transition-colors duration-300 font-bold"
          >
            Log In
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          New User?{" "}
          <Link
            href="/register/step-1"
            className="text-blue-500 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

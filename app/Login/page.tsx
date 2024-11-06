"use client";

import { useState } from "react";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@techconnect /src/database/firebaseConfiguration";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Autenticación de usuario con Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Verifica si el email está verificado
      if (user.emailVerified) {
        router.push("/");
      } else {
        setError(
          "Tu cuenta no está verificada. Por favor, revisa tu correo electrónico."
        );
      }
    } catch (error: any) {
      setError("Correo electrónico o contraseña incorrectos. Por favor, intenta nuevamente.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sección izquierda con el mapa */}
      <div className="flex-1 relative bg-gray-800">
        <div className="absolute inset-0 flex items-center justify-center text-white text-center">
          <h1 className="text-7xl font-bold">
            Your time is valuable, optimize every kilometer with us
          </h1>
        </div>
      </div>

      {/* Sección derecha con el formulario de login */}
      <div className="flex-1 bg-white p-8 flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-4">Log In</h2>
        <p className="text-sm text-gray-600 mb-6">
          Welcome, optimize your journeys, save time and always reach your
          destination in the most efficient way.
        </p>

        {/* Formulario de login con validación */}
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
              placeholder="ejemplo@correo.com"
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

          {/* Mostrar mensajes de error si existen */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="flex items-center justify-between mt-4">
            <div>
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
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
          <Link href="/register/step-1" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

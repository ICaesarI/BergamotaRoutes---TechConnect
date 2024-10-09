"use client";

import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar la lógica de inicio de sesión, como llamar a una API
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sección de izquierda con mapa */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center text-white text-center">
          <h1 className="text-7xl font-bold">Your time is valuable, optimize every kilometer whit us</h1>
        </div>
      </div>

      {/* Sección de derecha con el formulario de login */}
      <div className="flex-1 bg-white p-8 flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-4">Log In</h2>
        <p className="text-sm text-gray-600 mb-6">Welcome, optimize your journeys, save time and always reach your destination in the most efficient way.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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

          <div className="flex items-center justify-between mt-4">
            <div>
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
              ¿Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-black-main text-white p-4 rounded-lg hover:bg-blue-hover transition-colors duration-300 font-bold"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          ¿New User?{" "}
          <Link href="/Register" className="text-blue-500 hover:underline">
            SignUp
          </Link>
        </p>
      </div>
    </div>
  );
}
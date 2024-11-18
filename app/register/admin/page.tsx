"use client";

import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

export default function RegisterAdmin() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const db = getFirestore();

      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          const user = userCredential.user;
          console.log("Usuario registrado:", user);
        }
      );

      const { uid } = userCredential.user;

      // Datos para guardar
      const adminData = {
        uid,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        createdAt: new Date().toISOString(),
      };

      // Guardar en la colección "admins"
      await setDoc(doc(db, "admin", uid), adminData);

      // Guardar en la colección "users"
      await setDoc(doc(db, "users", uid), adminData);

      alert("Administrador registrado exitosamente.");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "admin",
      });
    } catch (error: any) {
      console.error("Error al registrar administrador:", error.message);
      alert("Hubo un error al registrar el administrador.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Registrar Admin
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre completo */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-600"
            >
              Nombre completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu nombre completo"
              required
            />
          </div>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-600"
            >
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@correo.com"
              required
            />
          </div>
          {/* Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-600"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          {/* Confirmar contraseña */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-gray-600"
            >
              Confirmar contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          {/* Rol */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-semibold text-gray-600"
            >
              Rol
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              readOnly
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:outline-none cursor-not-allowed"
            />
          </div>
          {/* Botón de registro */}
          <button
            type="submit"
            className="w-full py-3 px-4 text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}

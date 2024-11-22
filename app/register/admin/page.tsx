"use client";

import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

export default function RegisterAdmin() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
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
      const auth = getAuth();
      const db = getFirestore();
      const { email, password } = formData;

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid } = userCredential.user;

      const adminData = {
        uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        createdAt: new Date().toISOString(),
      };

      // Guardar en la colección "admin" y "users"
      await setDoc(doc(db, "admin", uid), adminData);
      await setDoc(doc(db, "users", uid), adminData);

      alert("Administrador registrado exitosamente.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
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
    <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4">
      <form
        className="form bg-gray-800 text-white p-6 rounded-2xl max-w-md w-full border border-gray-700"
        onSubmit={handleSubmit}
      >
        <p className="title text-2xl font-semibold text-cyan-400 mb-4">Register Admin</p>
        <p className="message text-sm text-gray-400 mb-4">
          Sign up now and get full access to our app.
        </p>

        <div className="flex gap-4">
          <label className="flex-1 relative">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="input w-full bg-gray-700 text-white py-3 px-4 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
            
          </label>

          <label className="flex-1 relative">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="input w-full bg-gray-700 text-white py-3 px-4 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
            
          </label>
        </div>

        <label className="relative mt-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="input w-full mt-2 bg-gray-700 text-white py-3 px-4 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
          
        </label>

        <label className="relative mt-4">
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="input w-full mt-2 bg-gray-700 text-white py-3 px-4 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
         
        </label>

        <label className="relative mt-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="input w-full mt-2 bg-gray-700 text-white py-3 px-4 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
        </label>

        <label className="relative mt-4">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="input w-full mt-2 bg-gray-700 text-white py-3 px-4 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="submit w-full mt-6 py-3 px-4 bg-cyan-400 text-white rounded-lg font-semibold hover:bg-cyan-500 transition"
        >
          {loading ? "Registering..." : "Submit"}
        </button>
        <p className="signin text-sm text-gray-400 mt-4 text-center">
          Already have an account? <a href="/Login" className="text-cyan-400">Sign in</a>
        </p>
      </form>
    </div>
  );
}

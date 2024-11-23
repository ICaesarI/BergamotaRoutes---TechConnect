"use client";

import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";

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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must include at least one uppercase letter.";
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = "Password must include at least one number.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
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
        password: formData.password,
        role: formData.role,
        createdAt: new Date().toISOString(),
      };

      // Guardar en la colección "admin" y "users"
      await setDoc(doc(db, "admin", uid), adminData);
      await setDoc(doc(db, "users", uid), adminData);

      // Mostrar ventana emergente de éxito
      Swal.fire({
        icon: "success",
        title: "Administrador registrado",
        text: "El administrador se registró exitosamente.",
        confirmButtonColor: "#06b6d4",
      });

      // Reiniciar el formulario
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

      // Mostrar ventana emergente de error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al registrar el administrador.",
        confirmButtonColor: "#f87171",
      });
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
        <p className="title text-2xl font-semibold text-cyan-400 mb-4">
          Register Admin
        </p>
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
              className={`input w-full bg-gray-700 text-white py-3 px-4 rounded-lg outline-none focus:ring-2 ${
                errors.firstName ? "ring-red-500" : "focus:ring-cyan-400"
              }`}
              required
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </label>

          <label className="flex-1 relative">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className={`input w-full bg-gray-700 text-white py-3 px-4 rounded-lg outline-none focus:ring-2 ${
                errors.lastName ? "ring-red-500" : "focus:ring-cyan-400"
              }`}
              required
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </label>
        </div>

        <label className="relative mt-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`input w-full mt-2 bg-gray-700 text-white py-3 px-4 rounded-lg outline-none focus:ring-2 ${
              errors.email ? "ring-red-500" : "focus:ring-cyan-400"
            }`}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </label>

        <label className="relative mt-4">
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className={`input w-full mt-2 bg-gray-700 text-white py-3 px-4 rounded-lg outline-none focus:ring-2 ${
              errors.phone ? "ring-red-500" : "focus:ring-cyan-400"
            }`}
            required
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </label>

        <label className="relative mt-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`input w-full mt-2 bg-gray-700 text-white py-3 px-4 rounded-lg outline-none focus:ring-2 ${
              errors.password ? "ring-red-500" : "focus:ring-cyan-400"
            }`}
            required
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </label>

        <label className="relative mt-4">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`input w-full mt-2 bg-gray-700 text-white py-3 px-4 rounded-lg outline-none focus:ring-2 ${
              errors.confirmPassword ? "ring-red-500" : "focus:ring-cyan-400"
            }`}
            required
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </label>

        <button
          type="submit"
          disabled={loading}
          className="submit w-full mt-6 py-3 px-4 bg-cyan-400 text-white rounded-lg font-semibold hover:bg-cyan-500 transition"
        >
          {loading ? "Registering..." : "Submit"}
        </button>
        <p className="signin text-sm text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <a href="/Login" className="text-cyan-400">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}

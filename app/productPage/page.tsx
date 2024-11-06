"use client";

import { useState } from "react";

export default function PurchasePage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    state: "",
    country: "",
    city: "",
    postalCode: "",
    phoneNumber: "",
    address: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sección izquierda con recuadro del producto */}
      <div className="flex-1 flex items-center justify-center bg-gray-200 p-4">
        <div className="w-1/2 h-1/2 border border-gray-500 rounded-lg flex items-center justify-center p-2">
          <p className="text-gray-600 text-center text-sm">Imagen del Producto</p>
        </div>
      </div>

      {/* Sección derecha con formulario de compra */}
      <div className="flex-1 bg-white p-4 flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-2">Formulario de Compra</h2>
        <p className="text-xs text-gray-600 mb-4">
          Completa tus datos para realizar la compra.
        </p>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label htmlFor="firstName" className="block text-xs font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="p-2 border border-gray-300 rounded w-full text-sm"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-xs font-medium text-gray-700">
              Apellido
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="p-2 border border-gray-300 rounded w-full text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="p-2 border border-gray-300 rounded w-full text-sm"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-xs font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              className="p-2 border border-gray-300 rounded w-full text-sm"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-xs font-medium text-gray-700">
              Dirección
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="p-2 border border-gray-300 rounded w-full text-sm"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-xs font-medium text-gray-700">
              Ciudad
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="p-2 border border-gray-300 rounded w-full text-sm"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-xs font-medium text-gray-700">
              Estado
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              required
              className="p-2 border border-gray-300 rounded w-full text-sm"
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-xs font-medium text-gray-700">
              País
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
              className="p-2 border border-gray-300 rounded w-full text-sm"
            />
          </div>

          <div>
            <label htmlFor="postalCode" className="block text-xs font-medium text-gray-700">
              Código Postal
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              required
              className="p-2 border border-gray-300 rounded w-full text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded hover:bg-gray-700 transition-colors duration-300 font-semibold text-sm"
          >
            Realizar Compra
          </button>
        </form>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@techconnect /src/database/firebaseConfiguration";
import { Logo } from "@techconnect /src/components/Logo";
import InputField from "@techconnect /src/components/inputField";
import emailIcon from "@techconnect /src/img/emailLogo.png";
import passwordIcon from "@techconnect /src/img/passwordLogo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
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
        router.push("/dashboard"); // Redirige al dashboard si el email está verificado
      } else {
        // Si el correo no está verificado, muestra el error
        setError(
          "Tu cuenta no está verificada. Por favor, revisa tu correo electrónico."
        );
      }
    } catch (error: any) {
      // Captura y muestra errores relacionados con el inicio de sesión
      setError("Error en el inicio de sesión: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-main">
      {/* Logo */}
      <Logo />

      {/* Formulario de Login */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-center text-3xl font-bold mb-6">Iniciar Sesión</h1>

        {/* Campo de Email */}
        <div className="mb-4">
          <InputField
            label="Correo Electrónico"
            placeholder="Ingresa tu correo"
            icon={emailIcon}
            value={email}
            onChange={setEmail}
          />
        </div>

        {/* Campo de Contraseña */}
        <div className="mb-4">
          <InputField
            label="Contraseña"
            type="password"
            placeholder="Ingresa tu contraseña"
            icon={passwordIcon}
            value={password}
            onChange={setPassword}
          />
        </div>

        {/* Mostrar mensajes de error si existen */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Botón de Iniciar Sesión */}
        <button
          onClick={handleLogin}
          className="bg-black-main text-white w-full text-center rounded-full text-2xl hover:opacity-80 transition duration-300 cursor-pointer p-3"
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
}

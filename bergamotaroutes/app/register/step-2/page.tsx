"use client";

import { Logo } from "@techconnect /src/components/Logo";
import { InfoBlock } from "@techconnect /src/components/infoBlock";
import packageImg from "@techconnect /src/img/packageImg.png";
import emailIcon from "@techconnect /src/img/emailLogo.png";
import userIcon from "@techconnect /src/img/userIcon.png";
import passwordIcon from "@techconnect /src/img/passwordLogo.png";
import phoneIcon from "@techconnect /src/img/phoneIcon.png";
import birthdayIcon from "@techconnect /src/img/birthdayIcon.png";
import cameraIcon from "@techconnect /src/img/cameraIcon.png";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Step_2() {
  const router = useRouter();

  // Handler functions for navigation
  const handleBack = () => {
    router.push("/register/step-1"); // Navega al paso anterior
  };

  const handleNext = () => {
    router.push("/register/step-3"); // Navega al siguiente paso
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Columna Izquierda */}
      <div className="bg-gray-main flex flex-col justify-between items-center p-6">
        <div className="flex flex-col gap-10">
          <Logo />
          {/* Bloques de Información */}
          <InfoBlock
            circleColor="bg-white"
            lineHeight="h-16"
            lineColor="bg-white"
            linebottom="-bottom-10"
            text="Personal Information"
            textColor="text-white"
          />
          <InfoBlock
            circleColor="bg-white"
            lineHeight="h-20"
            lineColor="bg-white"
            linebottom="-bottom-15"
            text="Account Information"
            textColor="text-white"
          />
          <InfoBlock
            circleColor="bg-black"
            lineHeight="h-0"
            lineColor="bg-gray-main"
            linebottom="-bottom-0"
            text="Confirm"
            textColor="text-black"
          />
        </div>
        <Image src={packageImg} alt="Package Image" width={250} height={250} />
      </div>

      {/* Columna Derecha */}
      <div className="bg-white p-8 h-screen">
        <h1 className="text-center text-3xl font-bold mb-6">
          Account Information
        </h1>

        {/* Campo de Email */}
        <div className="mb-4">
          <h2 className="font-bold text-xl">Email:</h2>
          <div className="flex items-center bg-gray-main p-3 rounded-lg">
            <Image
              src={emailIcon}
              alt="Email Icon"
              width={30}
              height={30}
              className="mr-3"
            />
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent outline-none flex-1 placeholder-white"
              required
            />
          </div>
        </div>

        {/* Campo de Contraseña */}
        <div className="mb-4">
          <h2 className="font-bold text-xl">Password:</h2>
          <div className="flex items-center bg-gray-main p-3 rounded-lg">
            <Image
              src={passwordIcon}
              alt="Password Icon"
              width={30}
              height={30}
              className="mr-3"
            />
            <input
              type="password"
              placeholder="Enter your password"
              className="bg-transparent outline-none flex-1 placeholder-white"
              required
            />
          </div>
        </div>

        {/* Confirmar Contraseña */}
        <div className="mb-4">
          <h2 className="font-bold text-xl">Confirm Password:</h2>
          <div className="flex items-center bg-gray-main p-3 rounded-lg">
            <Image
              src={passwordIcon}
              alt="Confirm Password Icon"
              width={30}
              height={30}
              className="mr-3"
            />
            <input
              type="password"
              placeholder="Confirm your password"
              className="bg-transparent outline-none flex-1 placeholder-white"
              required
            />
          </div>
        </div>

        {/* Número de Teléfono */}
        <div>
          <h2 className="font-bold text-xl">Phone Number:</h2>
          <div className="flex items-center bg-gray-main p-3 rounded-lg">
            <Image
              src={phoneIcon}
              alt="Phone Icon"
              width={30}
              height={30}
              className="mr-3"
            />
            <input
              type="tel"
              placeholder="Enter your phone number"
              className="bg-transparent outline-none flex-1 placeholder-white"
              required
            />
          </div>
        </div>

        {/* Botones de Navegación */}
        <div className="flex justify-between mt-8 pt-40">
          <button
            onClick={handleBack}
            className="bg-black-main text-white w-28 text-center rounded-full text-2xl hover:opacity-80 transition duration-300 cursor-pointer p-3"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-black-main text-white w-28 text-center rounded-full text-2xl hover:opacity-80 transition duration-300 cursor-pointer p-3"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

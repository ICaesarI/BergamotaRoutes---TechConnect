"use client";

import { Logo } from "@techconnect /src/components/Logo";
import { InfoBlock } from "@techconnect /src/components/infoBlock";
import NumberInput from "@techconnect /src/components/numberInput";
import packageImg from "@techconnect /src/img/packageImg.png";
import emailIcon from "@techconnect /src/img/emailLogo.png";
import userIcon from "@techconnect /src/img/userIcon.png";
import passwordIcon from "@techconnect /src/img/passwordLogo.png";
import phoneIcon from "@techconnect /src/img/phoneIcon.png";
import birthdayIcon from "@techconnect /src/img/birthdayIcon.png";
import cameraIcon from "@techconnect /src/img/cameraIcon.png";
import mobileImg from "@techconnect /src/img/mobileImg.png";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Step_2() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/register/step-2"); // Cambia esto a la ruta del paso anterior
  };

  const handleNext = () => {
    router.push("/"); // Cambia esto a la ruta del siguiente paso
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Columna Izquierda */}
      <div className="bg-gray-main flex flex-col justify-between items-center p-6">
        <div className="flex flex-col gap-10">
          <Logo />
          {/* InfoBlocks */}
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
            circleColor="bg-white"
            lineHeight="h-0"
            lineColor="bg-gray-main"
            linebottom="-bottom-0"
            text="Confirm"
            textColor="text-white"
          />
        </div>
        <Image
          src={packageImg}
          alt="Package Image"
          width={250}
          height={250}
          className="hidden md:block"
        />
      </div>

      {/* Columna Derecha */}
      <div className="bg-white p-8 h-screen flex flex-col justify-center">
        <h1 className="text-center text-2xl md:text-3xl font-bold mb-6">Confirm Account</h1>
        <div className="flex flex-col md:flex-row items-center text-lg md:text-3xl text-gray-main mb-6">
          <Image
            src={mobileImg}
            alt="Mobile Image"
            width={100}
            height={100}
            className="mb-4 md:mb-0 md:mr-4"
          />
          <p className="text-center md:text-left">We sent a confirmation code to your cell phone number</p>
        </div>
        <div className="mb-8">
          <NumberInput />
        </div>
        {/* Botones de Navegación */}
        <div className="flex justify-between pt-64">
          <button
            onClick={handleBack}
            className="bg-black-main text-white w-24 md:w-28 text-center rounded-full text-lg md:text-2xl hover:opacity-80 transition duration-300 cursor-pointer p-2 md:p-3"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-black-main text-white w-24 md:w-28 text-center rounded-full text-lg md:text-2xl hover:opacity-80 transition duration-300 cursor-pointer p-2 md:p-3"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
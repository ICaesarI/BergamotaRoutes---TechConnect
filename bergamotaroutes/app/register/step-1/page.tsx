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

export default function Step_1() {
  const [selectedGender, setSelectedGender] = useState("");
  const router = useRouter();

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
  };

  const handleNextClick = () => {
    router.push("/register/step-2");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Columna izquierda */}
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
            circleColor="bg-black"
            lineHeight="h-20"
            lineColor="bg-black"
            linebottom="-bottom-15"
            text="Account Information"
            textColor="text-black"
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
        <Image src={packageImg} alt="Package Image" width={250} height={250}/>
      </div>

      {/* Columna derecha */}
      <div className="bg-white p-8 flex flex-col justify-between h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
          Sign up and start optimizing your path to faster, more efficient destinations!
        </h1>

        {/* Inputs en una cuadrícula */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <h1 className="font-bold text-xl">Name:</h1>
            <div className="flex items-center bg-gray-main p-3 rounded-lg">
              <Image
                src={userIcon}
                alt="User Icon"
                width={30}
                height={30}
                className="mr-3"
              />
              <input
                type="text"
                placeholder="Enter your name"
                className="bg-transparent outline-none flex-1 text-white placeholder-white"
                required
              />
            </div>
          </div>

          {/* Apellido */}
          <div>
            <h1 className="font-bold text-xl">Last Name:</h1>
            <div className="flex items-center bg-gray-main p-3 rounded-lg">
              <Image
                src={userIcon}
                alt="User Icon"
                width={30}
                height={30}
                className="mr-3"
              />
              <input
                type="text"
                placeholder="Enter your last name"
                className="bg-transparent outline-none flex-1 text-white placeholder-white"
                required
              />
            </div>
          </div>

          {/* Fecha de nacimiento */}
          <div>
            <h1 className="font-bold text-xl">Birthday:</h1>
            <div className="flex items-center bg-gray-main p-3 rounded-lg">
              <Image
                src={birthdayIcon}
                alt="Birthday Icon"
                width={30}
                height={30}
                className="mr-3"
              />
              <input
                type="date"
                className="bg-transparent outline-none flex-1 text-white"
                required
              />
            </div>
          </div>

          {/* Subir foto */}
          <div className="flex items-center gap-4">
            <div className="flex items-center p-3 border border-gray-500 rounded-full w-12 h-12 opacity-75 hover:opacity-100 hover:border-blue-500 cursor-pointer transition-opacity duration-300">
              <Image src={cameraIcon} alt="Camera Icon" width={30} height={30} />
            </div>
            <h1 className="font-bold text-xl">Upload a photo</h1>
          </div>
        </div>

        {/* Selección de género */}
        <div className="flex flex-col items-center justify-center mt-6">
          <h1 className="font-bold text-xl mb-4">Gender:</h1>
          <div className="flex gap-4">
            <p
              onClick={() => handleGenderSelect("Male")}
              className={`w-32 text-center py-2 rounded-lg cursor-pointer transition-all duration-300 ${
                selectedGender === "Male"
                  ? "bg-black text-white"
                  : "bg-white text-black border border-black"
              }`}
            >
              Male
            </p>
            <p
              onClick={() => handleGenderSelect("Female")}
              className={`w-32 text-center py-2 rounded-lg cursor-pointer transition-all duration-300 ${
                selectedGender === "Female"
                  ? "bg-black text-white"
                  : "bg-white text-black border border-black"
              }`}
            >
              Female
            </p>
          </div>
        </div>

        {/* Botón de siguiente */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleNextClick}
            className="bg-black text-white text-2xl rounded-full w-28 py-2 hover:opacity-80 transition duration-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
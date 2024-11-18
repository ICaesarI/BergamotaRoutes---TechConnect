"use client";

import { Logo } from "@techconnect /src/components/Logo";
import { InfoBlock } from "@techconnect /src/components/infoBlock";
import packageImg from "@techconnect /src/img/packageImg.png";
import userIcon from "@techconnect /src/img/userIcon.png";
import birthdayIcon from "@techconnect /src/img/birthdayIcon.png";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { validateName } from "@techconnect /src/security/validateName";
import { validateBirthday } from "@techconnect /src/security/validateBirthdat";
import { validateImage } from "@techconnect /src/security/validateImage";

import InputField from "@techconnect /src/components/inputField";
import GenderSelection from "@techconnect /src/components/genderSelection";
import PhotoUpload from "@techconnect /src/components/photoUpload";

import { useRegister } from "@techconnect /src/components/context/registerContext";

export default function Step_1() {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    lastname?: string;
    birthday?: string;
    gender?: string;
    image?: string;
  }>({});
  const [selectedGender, setSelectedGender] = useState("");

  const router = useRouter();
  const { updateRegisterData } = useRegister();

  const handleImageChange = (image: string | null) => {
    setProfileImage(image);
  };

  // Manejo de la selección de género
  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
    setErrors((prev) => ({ ...prev, gender: undefined })); // Limpia el error de género cuando se selecciona uno
  };

  // Manejo del clic en el botón "Siguiente"
  const handleNextClick = () => {
    const newErrors: {
      name?: string;
      lastname?: string;
      birthday?: string;
      gender?: string;
      image?: string;
    } = {};

    if (!validateName(name)) {
      newErrors.name = "El nombre es inválido";
    }

    if (!validateName(lastname)) {
      newErrors.lastname = "El apellido es inválido";
    }

    if (!validateBirthday(birthday)) {
      newErrors.birthday = "La fecha de nacimiento es requerida";
    }

    if (!selectedGender) {
      newErrors.gender = "El género es requerido";
    }

    if (!profileImage) {
      newErrors.image = "La imagen es requerida";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    updateRegisterData({
      name,
      lastname,
      birthday,
      selectedGender,
      profileImage,
    });
    router.push("/register/step-2");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Columna izquierda */}
      <div className="bg-gray-main flex flex-col justify-between items-center p-6">
        <div className="flex flex-col gap-10">
          <Logo />
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
        <Image src={packageImg} alt="Package Image" width={250} height={250} />
      </div>

      {/* Columna derecha */}
      <div className="bg-white p-8 flex flex-col justify-between h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
          Sign up and start optimizing your path to faster, more efficient
          destinations!
        </h1>
        {/* Inputs en una cuadrícula */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <InputField
              label="Nombre:"
              placeholder="Enter your name"
              icon={userIcon}
              value={name}
              onChange={setName}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}{" "}
            {/* Mostrar error */}
          </div>
          {/* Apellido */}
          <div>
            <InputField
              label="Last Name:"
              placeholder="Enter your last name"
              icon={userIcon}
              value={lastname}
              onChange={setLastname}
            />
            {errors.lastname && (
              <p className="text-red-500 text-sm">{errors.lastname}</p>
            )}{" "}
            {/* Mostrar error */}
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
                onChange={(e) => setBirthday(e.target.value)}
              />
            </div>
            {errors.birthday && (
              <p className="text-red-500 text-sm">{errors.birthday}</p> // Mostrar error
            )}
          </div>
          {/* Subir foto */}
          {/* Subir foto */}
          <PhotoUpload onImageChange={handleImageChange} />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image}</p>
          )}
          {/* Mostrar error de imagen */}
        </div>
        {/* Selección de género */}
        <GenderSelection
          selectedGender={selectedGender}
          handleGenderSelect={handleGenderSelect}
        />
        {errors.gender && (
          <p className="text-red-500 text-sm">{errors.gender}</p>
        )}{" "}
        {/* Mostrar error de género */}
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

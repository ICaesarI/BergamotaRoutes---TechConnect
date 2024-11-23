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
import Swal from "sweetalert2";
import LoadingCart from "@techconnect /src/components/loader"; // Asegúrate de que este sea tu componente de carga

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
  const [isloader, setIsLoading] = useState(false); // Estado para manejar la carga


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
    const newErrors: { [key: string]: string } = {};

    // Validaciones y captura de errores personalizados
    const nameError = validateName(name);
    if (nameError) {
      newErrors.name = nameError;
    }

    const lastnameError = validateName(lastname); // Usando la misma lógica para el apellido
    if (lastnameError) {
      newErrors.lastname = lastnameError;
    }

    const birthdayError = validateBirthday(birthday); // Validación de la fecha de nacimiento
    if (birthdayError) {
      newErrors.birthday = birthdayError;
    }

    if (!selectedGender) {
      newErrors.gender = "El género es requerido.";
    }

    const imageError = validateImage(profileImage); // Validación de la imagen
    if (imageError) {
      newErrors.image = imageError;
    }

    // Si hay errores, mostramos una alerta y no continuamos
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      const errorMessages = Object.values(newErrors).join("<br />"); // Unir los errores con saltos de línea

      // Mostramos un SweetAlert2 con los errores
      Swal.fire({
        icon: "error",
        title: "Formulario incompleto",
        html: errorMessages,
        confirmButtonText: "Aceptar",
      });

      return;
    }

    // Mostrar pantalla de carga
    setIsLoading(true);

    // Si no hay errores, vaciamos los errores y actualizamos los datos
    setErrors({});
    setTimeout(() => {
      // Actualizar datos de registro
      updateRegisterData({
        name,
        lastname,
        birthday,
        selectedGender,
        profileImage,
      });

      // Redirigir a la siguiente página
      router.push("/register/step-2");
    }, 2000); // Cambia el tiempo si lo necesitas
  };

  // Calcula la fecha mínima
  const getMinDate = () => {
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 80);
    return minDate.toISOString().split("T")[0]; // Formato "YYYY-MM-DD"
  };

  // Calcula la fecha máxima (debe ser mayor de 18 años)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);
    return maxDate.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Column */}
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

      {/* Right Column */}
      <div className="bg-white p-8 flex flex-col justify-between h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
          Sign up and start optimizing your path to faster, more efficient
          destinations!
        </h1>

        {/* Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <InputField
              label="Name:"
              type="text"
              placeholder="Enter your name"
              icon={userIcon}
              value={name}
              onChange={setName}
              
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          {/* Last Name */}
          <div>
            <InputField
              label="Last Name:"
              type="text"
              placeholder="Enter your last name"
              icon={userIcon}
              value={lastname}
              onChange={setLastname}
            
            />
            {errors.lastname && (
              <p className="text-red-500 text-sm">{errors.lastname}</p>
            )}
          </div>
          {/* Birthday */}
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
                min={getMinDate()} // Establecer el mínimo
                max={getMaxDate()} // Establecer el máximo
              />
            </div>
            {errors.birthday && (
              <p className="text-red-500 text-sm">{errors.birthday}</p>
            )}
          </div>
          <div>
            {/* Upload Photo */}
            <PhotoUpload onImageChange={handleImageChange} />
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col text-center">
          {/* Gender Selection */}
          <GenderSelection
            selectedGender={selectedGender}
            handleGenderSelect={handleGenderSelect}
          />
          <br />
          {errors.gender && (
            <p className="text-center text-red-500 text-sm">{errors.gender}</p>
          )}
        </div>

        {/* Next Button */}
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

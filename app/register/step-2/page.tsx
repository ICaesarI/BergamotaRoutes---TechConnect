"use client";

import { Logo } from "@techconnect /src/components/Logo";
import { InfoBlock } from "@techconnect /src/components/infoBlock";
import packageImg from "@techconnect /src/img/packageImg.png";
import emailIcon from "@techconnect /src/img/emailLogo.png";
import passwordIcon from "@techconnect /src/img/passwordLogo.png";
import phoneIcon from "@techconnect /src/img/phoneIcon.png";

import { validateEmail } from "@techconnect /src/security/validateEmail";
import { validatePasswordInput } from "@techconnect /src/security/validatePassword";
import { validatePhoneNumber } from "@techconnect /src/security/validatePhoneNumber";

import InputField from "@techconnect /src/components/inputField";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useRegister } from "@techconnect /src/components/context/registerContext";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

import { auth, db } from "@techconnect /src/database/firebaseConfiguration";
import { doc, setDoc } from "firebase/firestore";
import PhotoUpload from "@techconnect /src/components/photoUpload";
import Swal from "sweetalert2";

export default function Step_2() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { registerData, updateRegisterData } = useRegister();

  const handleBack = () => router.push("/register/step-1");

  // Manejo del clic en el botón "Siguiente"
  // Change the handleNextClick function to be asynchronous
  const handleNextClick = async () => {
    // Add 'async' here
    const newErrors: { [key: string]: string } = {};

    const emailError = validateEmail(email); // Validación del correo electrónico
    if (emailError) {
      newErrors.email = emailError;
    }

    // Validación de la contraseña
    const passwordError = validatePasswordInput(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (password !== passwordConfirm) {
      newErrors.passwordConfirm = "Las contraseñas no coinciden.";
    }

    const phoneError = validatePhoneNumber(phoneNumber);
    if (phoneError) {
      newErrors.phoneNumber = phoneError;
    }

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
      return; // Exit early if there are errors
    }

    setErrors({});
    updateRegisterData({ email, password, phoneNumber });

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);

      if (registerData.profileImage) {
        const storage = getStorage();
        const storageRef = ref(
          storage,
          `driversProfilePictures/${user.uid}/profileImage.jpg`
        );
        await uploadString(storageRef, registerData.profileImage, "data_url");
        const imageUrl = await getDownloadURL(storageRef);

        await setDoc(doc(db, "request", user.uid), {
          ...registerData,
          uid: user.uid,
          name,
          email,
          password,
          phoneNumber,
          profileImage: imageUrl,
          createdAt: new Date(),
        });
      }

      router.push("/register/step-3");
    } catch (error) {
      console.error("Error al registrar al usuario:", error);
      alert("Error al registrar al usuario: " + error.message);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
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

      <div className="bg-white p-8 h-screen">
        <h1 className="text-center text-3xl font-bold mb-6">
          Account Information
        </h1>

        <div className="mb-4">
          <h2 className="font-bold text-xl">Email:</h2>
          <div className="flex items-center bg-gray-main p-3 rounded-lg">
            <InputField
              label=""
              type="email"
              placeholder="Enter your email address"
              icon={emailIcon}
              value={email}
              onChange={setEmail}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <h2 className="font-bold text-xl">Password:</h2>
          <div className="flex items-center bg-gray-main p-3 rounded-lg">
            <InputField
              label=""
              type="password"
              placeholder="Enter your password"
              icon={passwordIcon}
              value={password}
              onChange={setPassword}
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        <div className="mb-4">
          <h2 className="font-bold text-xl">Confirm Password:</h2>
          <div className="flex items-center bg-gray-main p-3 rounded-lg">
            <InputField
              label=""
              type="password"
              placeholder="Confirm your password"
              icon={passwordIcon}
              value={passwordConfirm}
              onChange={setPasswordConfirm}
            />
          </div>
          {errors.passwordConfirm && (
            <p className="text-red-500 text-sm">{errors.passwordConfirm}</p>
          )}
        </div>

        <div className="mb-4">
          <h2 className="font-bold text-xl">Phone Number:</h2>
          <div className="flex items-center bg-gray-main p-3 rounded-lg">
            <InputField
              label=""
              placeholder="Enter your phone number"
              icon={phoneIcon}
              value={phoneNumber}
              onChange={setPhoneNumber}
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className="bg-black-main text-white w-28 text-center rounded-full text-2xl hover:opacity-80 transition duration-300 cursor-pointer p-3"
          >
            Back
          </button>
          <button
            onClick={handleNextClick}
            className="bg-black-main text-white w-28 text-center rounded-full text-2xl hover:opacity-80 transition duration-300 cursor-pointer p-3"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

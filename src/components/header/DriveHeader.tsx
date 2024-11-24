"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Logo } from "../Logo";
import { Menu, Close } from "@mui/icons-material";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { auth, db } from "@techconnect /src/database/firebaseConfiguration";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Importa Firestore
import driverIcon from "@techconnect /src/img/userIcon.png";

export function DriveHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef(null); // Referencia para el perfil

  const toggleMenu = () => setIsOpen(!isOpen);
  const currentRoute = usePathname(); // Obtenemos la ruta actual
  const [driverData, setDriverData] = useState(null); // Para almacenar los datos del driver logueado

  useEffect(() => {
    const user = auth.currentUser; // Obtener el usuario logueado

    if (user) {
      const userRef = doc(db, "drivers", user.uid); // Asumiendo que tienes una colección 'drivers'
      getDoc(userRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            // Si existe el documento, obtén los datos
            setDriverData(docSnap.data());
          } else {
            Swal.fire({
              icon: "error",
              title: "No se encontró el documento",
              text: "No se pudo encontrar los datos del driveristrador en la base de datos.",
            });
          }
        })
        .catch((error) => {
          console.error("Error obteniendo datos del driveristrador: ", error);
          Swal.fire({
            icon: "error",
            title: "Error al obtener datos",
            text: "Hubo un problema al intentar obtener los datos del administrador.",
          });
        });
    }
  }, []);

  return (
    <header className="flex flex-col items-center w-full border-b-2 border-black-main bg-black-main p-4 lg:flex-row">
      <div className="flex flex-col justify-center lg:flex-row w-full items-center justify-between lg:w-auto">
        <Logo />

        <div>
          <button
            onClick={toggleMenu}
            className="text-white ml-auto lg:hidden mt-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <Close fontSize="large" /> : <Menu fontSize="large" />}
          </button>
        </div>
      </div>

      <nav
        className={`${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden transition-all duration-500 ease-in-out lg:max-h-full lg:opacity-100 lg:flex flex-col lg:flex-row lg:items-center lg:justify-center mt-4 lg:mt-0`}
      >
        <ul className="flex flex-col lg:flex-row gap-4 text-center text-lg font-medium text-white">
          <li>
            <Link
              href="/"
              className={`${
                currentRoute === "/" ? "text-blue-500" : "text-white"
              } hover:text-blue-hover transition-colors duration-300 font-bold text-2xl`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/tracking"
              className={`${
                currentRoute === "/tracking" ? "text-blue-500" : "text-white"
              } hover:text-blue-hover transition-colors duration-300 font-bold text-2xl`}
            >
              Start Route
            </Link>
          </li>
          <li>
            <Link
              href="/Driver"
              className={`${
                currentRoute === "/profile" ? "text-blue-500" : "text-white"
              } hover:text-blue-hover transition-colors duration-300 font-bold text-2xl`}
            >
              <img
                src={driverData?.profileImage || driverIcon}
                alt="Admin Profile"
                className="h-12 w-12 rounded-full border-4 border-white shadow-lg hover:shadow-2xl transition-all duration-300 object-cover transform hover:scale-110 hover:rotate-6"
              />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

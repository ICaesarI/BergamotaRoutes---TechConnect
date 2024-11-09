"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Importamos usePathname para obtener la ruta actual
import { Logo } from "./Logo";
import locationLogo from "@techconnect /src/img/locationLogo.svg";

export function Header() {
  const currentRoute = usePathname(); // Obtenemos la ruta actual

  return (
    <div className="flex items-center justify-between gap-5 p-2 border-2 border-black-main bg-black-main">
      <Logo />
      <nav>
        <ul className="flex gap-4 text-sm font-medium text-3x1">
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
              href="../map/UserView"
              className={`${
                currentRoute === "/map/UserView" ? "text-blue-500" : "text-white"
              } hover:text-blue-hover transition-colors duration-300 font-bold text-2xl`}
            >
              Tracking
            </Link>
          </li>
          <li>
            <Link
              href="/map"
              className={`${
                currentRoute === "/map" ? "text-blue-500" : "text-white"
              } hover:text-blue-hover transition-colors duration-300 font-bold text-2xl`}
            >
              Routes
            </Link>
          </li>
          <li>
            <Link
              href="/Login"
              className={`${
                currentRoute === "/Login" ? "text-blue-500" : "text-white"
              } hover:text-blue-hover transition-colors duration-300 font-bold text-2xl`}
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              href="/register/step-1"
              className={`${
                currentRoute === "/register/step-1" ? "bg-blue-500" : "bg-black"
              } text-white p-1 rounded-lg hover:bg-blue-hover transition-colors duration-300 text-2xl`}
            >
              Register
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

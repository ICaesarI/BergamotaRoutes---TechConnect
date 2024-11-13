"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "../Logo";
import { Menu, Close } from "@mui/icons-material";
import { usePathname } from "next/navigation";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const currentRoute = usePathname(); // Obtenemos la ruta actual

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
              href="/Register"
              className={`${
                currentRoute === "/Register" ? "text-blue-500" : "text-white"
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
              className="text-2xl bg-white text-black-main px-5 py-3 rounded-lg hover:bg-blue-hover hover:text-white transition-colors duration-300 font-bold"
            >
              Register
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

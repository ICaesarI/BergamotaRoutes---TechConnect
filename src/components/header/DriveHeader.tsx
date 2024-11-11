"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "../Logo";
import { Menu, Close } from "@mui/icons-material";

export function DriveHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

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
              className="hover:text-blue-hover transition-colors duration-300 font-bold"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/tracking"
              className="hover:text-blue-hover transition-colors duration-300 font-bold"
            >
              Start Route
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className="hover:text-blue-hover transition-colors duration-300 font-bold"
            >
              Ver Perfil
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

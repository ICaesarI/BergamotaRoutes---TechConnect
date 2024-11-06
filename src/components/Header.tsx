"use client";

import Image from "next/image";
import Link from "next/link";

import { Logo } from "./Logo";
import locationLogo from "@techconnect /src/img/locationLogo.svg";

export function Header() {
  return (
    <div className="flex items-center justify-between gap-5 p-2 border-2 border-black-main bg-black-main">
      <Logo />
      <nav>
        <ul className="flex gap-4 text-sm font-medium text-3xl">
          <li>
            <Link
              href="/"
              className="hover:text-blue-hover transition-colors duration-300 font-bold text-white"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/Register"
              className="hover:text-blue-hover transition-colors duration-300 font-bold text-white"
            >
              Routes
            </Link>
          </li>
          <li>
            <Link
<<<<<<< HEAD
              href="/login"
              className="hover:text-blue-hover transition-colors duration-300 font-bold"
=======
              href="/Login"
              className="hover:text-blue-hover transition-colors duration-300 font-bold text-white"
>>>>>>> origin
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              href="/register/step-1"
              className="bg-black text-white p-1 rounded-lg hover:bg-blue-hover transition-colors duration-300"
            >
              Register
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

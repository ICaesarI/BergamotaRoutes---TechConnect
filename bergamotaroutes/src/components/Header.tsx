"use client";

import Image from "next/image";
import Link from "next/link";

import { Logo } from "./Logo";
import locationLogo from "@techconnect /src/img/locationLogo.svg";

export function Header() {

  return (
    <div>
      <div className="flex items-center gap-11 border-2 border-black-main bg-black-main">
        <Logo />
        <nav>
          <ul className="text-base font-medium text-black-main text-3xl">
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
                href="/contact"
                className="hover:text-blue-hover transition-colors duration-300 font-bold text-white"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                href="/register/step-1"
                className="bg-black text-white p-1 rounded-lg hover:bg-blue-hover transition-colors duration-300 "
              >
                Register
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

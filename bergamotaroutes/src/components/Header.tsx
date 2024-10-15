"use client";

import Image from "next/image";
import Link from "next/link";

import locationLogo from "@techconnect /src/img/locationLogo.svg";

export function Header() {
  return (
    <div className="flex items-center justify-between gap-5 p-2 border-2 border-black-main">
      <div className="flex gap-2 items-center text-4xl">
        <Image src={locationLogo} alt="Location logo" className="w-12 h-12" />
        <h1 className="font-bold">BergamotaRoutes</h1>
      </div>
      <nav>
        <ul className="flex gap-4 text-sm font-medium text-black-main text-3xl">
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
              href="/Register"
              className="hover:text-blue-hover transition-colors duration-300 font-bold"
            >
              Routes
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="hover:text-blue-hover transition-colors duration-300 font-bold"
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="bg-black-main text-white p-1 rounded-lg hover:bg-blue-hover transition-colors duration-300 "
            >
              Register
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

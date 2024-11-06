// layout.tsx
"use client";

import Link from "next/link";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Header } from "@techconnect /src/components/Header";
import { Footer } from "@techconnect /src/components/Footer";
import { usePathname } from "next/navigation";

// Aplicando la fuente Roboto
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMapPage = pathname === "/map"; // Verifica si la ruta actual es '/map'

  return (
    <html lang="en" className={roboto.className}>
      <body>
        {!isMapPage && <Header />}
        <div className="main-container">{children}</div>
        {!isMapPage && <Footer />}
      </body>
    </html>
  );
}

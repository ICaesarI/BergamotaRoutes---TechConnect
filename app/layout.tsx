// layout.tsx
"use client";

import Link from "next/link";
import { Roboto } from "next/font/google";
import "./globals.css";
import { MainLayout } from "@techconnect /src/components/header/MainHeader";
import { Footer } from "@techconnect /src/components/Footer";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@techconnect /src/auth/useAuth";

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
  const isMapPage = pathname.startsWith("/map"); // Verifica si la ruta actual es '/map'

  return (
    <AuthProvider>
      <html lang="en" className={roboto.className}>
        <body>
          {!isMapPage && <MainLayout />}
          <div className="main-container">{children}</div>
          {!isMapPage && <Footer />}
        </body>
      </html>
    </AuthProvider>
  );
}

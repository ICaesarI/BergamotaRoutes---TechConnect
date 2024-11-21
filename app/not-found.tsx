import Link from "next/link";
import Image from "next/image";

import cat1 from "@techconnect /src/img/cat1.png";
import cat2 from "@techconnect /src/img/cat2.png";
import dog1 from "@techconnect /src/img/dog1.png";
import dog2 from "@techconnect /src/img/dog2.png";

export default function NotFound() {
  const images = [cat1, cat2, dog1, dog2];
  const randomImage = images[Math.floor(Math.random() * images.length)];

  return (
    <section className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Página no encontrada</p>
      <div className="mb-6">
        <Image
          src={randomImage}
          alt="Not Found Image"
          width={300}
          height={300}
          className="rounded"
        />
      </div>
      <Link
        href="/"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition duration-200"
      >
        Volver
      </Link>
    </section>
  );
}

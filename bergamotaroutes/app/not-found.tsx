import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Página no encontrada</p>
      <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition duration-200">
        Volver
      </Link>
    </section>
  );
}

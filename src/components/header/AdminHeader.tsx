import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Logo } from "../Logo";
import { Menu, Close } from "@mui/icons-material";
import { usePathname } from "next/navigation";
import adminIcon from "@techconnect /src/img/adminIcon.png";
import { getAuth, signOut } from "firebase/auth"; // Importa el método para cerrar sesión
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Importa Firestore
import { auth, db } from "@techconnect /src/database/firebaseConfiguration";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function AdminHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false); // Estado para mostrar el perfil
  const profileRef = useRef(null); // Referencia para el perfil
  const [adminData, setAdminData] = useState(null); // Para almacenar los datos del admin logueado

  const toggleMenu = () => setIsOpen(!isOpen);
  const route = useRouter();
  const currentRoute = usePathname(); // Obtenemos la ruta actual

  const handleProfileClick = (e) => {
    e.preventDefault(); // Previene la acción por defecto del enlace
    setShowProfile(true); // Muestra el perfil
  };

  // Maneja clics fuera del perfil
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false); // Cierra el perfil si se hace clic fuera
      }
    };

    // Agrega el evento de clic
    document.addEventListener("mousedown", handleClickOutside);

    // Limpia el evento al desmontar el componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Obtén los datos del usuario logueado desde Firebase
  useEffect(() => {
    const user = auth.currentUser; // Obtener el usuario logueado

    if (user) {
      const userRef = doc(db, "admin", user.uid); // Asumiendo que tienes una colección 'admins'
      getDoc(userRef).then((docSnap) => {
        if (docSnap.exists()) {
          // Si existe el documento, obtén los datos
          setAdminData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      });
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Cerrar sesión
      setShowProfile(false); // Cierra el perfil después de cerrar sesión
      route.push("/Login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

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
        <ul className="flex flex-col lg:flex-row gap-6 text-center text-lg font-medium text-white">
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
              href="/admin"
              className={`${
                currentRoute === "/admin" ? "text-blue-500" : "text-white"
              } hover:text-blue-hover transition-colors duration-300 font-bold text-2xl`}
            >
              Admin
            </Link>
          </li>
          <li className="flex items-center justify-center">
            <a
              href="/profile/admin"
              onClick={handleProfileClick}
              className="text-white hover:text-blue-hover transition-colors duration-300"
            >
              <Image
                src={adminData?.photoURL || adminIcon}
                alt="Admin Profile"
                className="h-12 w-12 rounded-full border-4 border-white shadow-lg hover:shadow-2xl transition-all duration-300 object-cover transform hover:scale-110 hover:rotate-6"
              />
            </a>
          </li>
        </ul>
      </nav>

      {showProfile && adminData && (
        <div
          ref={profileRef}
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
          onClick={() => setShowProfile(false)}
        >
          <div
            className="relative w-80 md:w-96 bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-24 bg-green-400"></div>
            <div className="flex flex-col items-center gap-4 px-5 py-5">
              <div className="-mt-20">
                <Image
                  src={adminData.photoURL || adminIcon}
                  alt="Admin Profile"
                  className="h-40 w-40 rounded-full border-4 border-white"
                />
              </div>
              <h3 className="font-semibold text-lg">{adminData.name}</h3>
              <p className="text-gray-600">{adminData.email}</p>
              <p className="text-gray-500">{adminData.role}</p>
              <div className="mt-4 flex gap-4">
                <Link
                  href="/admin/edit"
                  className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "@techconnect /src/database/firebaseConfiguration";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";

export default function DriverInfo() {
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const { uid } = user;

          // Obtener datos del administrador
          const driverDocRef = doc(db, "drivers", uid);
          const driverDoc = await getDoc(driverDocRef);

          if (driverDoc.exists()) {
            const driverData = driverDoc.data();

            // Formatear createdAt si existe
            if (driverData?.createdAt) {
              driverData.createdAt = new Date(
                driverData.createdAt.seconds * 1000
              ).toLocaleString();
            }

            setUserData(driverData);
          } else {
            router.push("/no-access");
          }
        } catch (error) {
          console.error("Error al obtener datos del driver:", error);
        }
      } else {
        router.push("/error");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Logging out will end your current session!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await signOut(auth);
          router.push("/"); // Redirect to login
          Swal.fire(
            "Logged out!",
            "You have successfully logged out.",
            "success"
          );
        } catch (error) {
          console.error("Error logging out", error);
          Swal.fire(
            "Error",
            "There was a problem logging out. Please try again.",
            "error"
          );
        }
      }
    });
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="m-10 my-10">
      <h1 className="font-bold text-3xl sm:text-4xl text-center mb-4">
        Driver information
      </h1>
      <div className="flex items-center max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300">
        <div className="w-1/3 flex justify-center items-center p-4">
          <img
            src={userData?.profileImage}
            alt="Paisaje"
            className="object-cover rounded-full h-24 w-24"
            data-aos="fade-up"
          />
        </div>
        <div className=" w-2/3 p-4">
          <div className="flex mt-2 justify-between">
            <h2 className="text-sm m-2 font-bold">Nombre: </h2>
            <h2 className="text-sm m-2">
              {userData?.name || "error"} {userData?.lastname || "error"}
            </h2>
          </div>
          <hr />
          <div className="flex mt-2 justify-between">
            <h2 className="text-sm m-2 font-bold">Email: </h2>
            <h2 className="text-sm m-2">{userData?.email || "error"}</h2>
          </div>
          <hr />
          <div className="flex mt-2 justify-between">
            <h2 className="text-sm m-2 font-bold">Teléfono: </h2>
            <h2 className="text-sm m-2">{userData?.phoneNumber || "error"}</h2>
          </div>
          <hr />
          <div className="flex mt-2 justify-between">
            <h2 className="text-sm m-2 font-bold">Driver ID: </h2>
            <h2 className="m-2 text-sm">{userData?.driverUID || "error"}</h2>
          </div>
          <hr />
        </div>
      </div>
      <div className="flex items-center max-w-xl mx-auto justify-between">
        <Link
          href="/Driver/Modify"
          className="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-green-800 rounded-md group px-6 py-2 mt-4"
        >
          <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-orange-600 rounded-full group-hover:w-56 group-hover:h-56"></span>
          <span className="absolute bottom-0 left-0 h-full -ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-auto h-full opacity-100 object-stretch"
              viewBox="0 0 487 487"
            >
              <path
                fillOpacity=".1"
                fillRule="nonzero"
                fill="#FFF"
                d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
              ></path>
            </svg>
          </span>
          <span className="absolute top-0 right-0 w-12 h-full -mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="object-cover w-full h-full"
              viewBox="0 0 487 487"
            >
              <path
                fillOpacity=".1"
                fillRule="nonzero"
                fill="#FFF"
                d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
              ></path>
            </svg>
          </span>
          <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-200"></span>
          <span className="relative text-base font-semibold">Edit info</span>
        </Link>

        <Link
          href="#"
          className="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-red-800 rounded-md group px-6 py-2 mt-4"
        >
          <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-red-600 rounded-full group-hover:w-56 group-hover:h-56"></span>
          <span className="absolute bottom-0 left-0 h-full -ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-auto h-full opacity-100 object-stretch"
              viewBox="0 0 487 487"
            >
              <path
                fillOpacity=".1"
                fillRule="nonzero"
                fill="#FFF"
                d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
              ></path>
            </svg>
          </span>
          <span className="absolute top-0 right-0 w-12 h-full -mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="object-cover w-full h-full"
              viewBox="0 0 487 487"
            >
              <path
                fillOpacity=".1"
                fillRule="nonzero"
                fill="#FFF"
                d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
              ></path>
            </svg>
          </span>
          <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-200"></span>
          <span
            className="relative text-base font-semibold"
            onClick={handleSignOut}
          >
            Log Out
          </span>
        </Link>
      </div>
    </div>
  );
}

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
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@techconnect /src/database/firebaseConfiguration";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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
              driverData.createdAt = new Date(driverData.createdAt.seconds * 1000).toLocaleString();
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

  if (!userData) {
    return null;
  }

  return (
    <div className="m-10 my-10">
        <h1 className="font-bold text-3xl sm:text-4xl text-center mb-4">
            Edit your Email
        </h1>
        <div className="flex items-center max-w-md mx-auto justify-between m-2">
            <Link href="/Driver/Modify"
            className="bg-white text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group"
            type="button"
            >
            <div
                className="bg-green-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500"
            >
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
                height="25px"
                width="25px"
                >
                <path
                    d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                    fill="#000000"
                ></path>
                <path
                    d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                    fill="#000000"
                ></path>
                </svg>
            </div>
            <p className="translate-y-2">Go Back</p>
            </Link>

        </div>
        <div className="flex max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300">
            <div className="w-full h-full">
                <div className="flex mt-2 justify-between">
                    <h2 className="w-1/2 text-sm m-2 font-bold">Email: </h2>
                    <h2 className="w-2/2 text-sm m-2">
                        {userData?.email || "error"}
                    </h2>                    
                </div>   
                <hr />                         
                <div className="flex mt-2 justify-between m-2">
                    <input 
                        id="nombre" 
                        type="text" 
                        placeholder="Ingresa tu nuevo email" 
                        className="border p-2 rounded"
                    />
                    <Link href="/" className="bg-blue-500 text-white font-bold py-2 px-4 rounded m-2 hover:bg-black-main hover:text-white">
                      Modify
                    </Link> 
                </div>
            </div>            
        </div>
    </div>
    );
}
"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  getDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@techconnect /src/database/firebaseConfiguration";
import { deleteUser } from "firebase/auth";
import { Password } from "@mui/icons-material";
import desertImage from "@techconnect /src/img/desert.png"; // Make sure the path is correct.
import Image from "next/image";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2"; // Import SweetAlert2

interface RequestData {
  uid: string;
  name: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  profileImage: string;
  password: string;
}

const RequestsList: React.FC = () => {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [user, setUser] = useState<any>(null); // Estado para guardar los datos del usuario
  const [loading, setLoading] = useState<boolean>(true); // Estado para manejar el estado de carga
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();

  // Verificar el estado de autenticación del usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Usuario autenticado, obtener su rol
        const userRef = doc(db, "admin", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        setUser(user); // Guardamos el usuario autenticado
      } else {
        // Usuario no autenticado
        setIsAdmin(false);
        setUser(null);
      }
      setLoading(false); // Terminar el estado de carga
    });

    const fetchRequests = async () => {
      const querySnapshot = await getDocs(collection(db, "request"));
      const requestData: RequestData[] = querySnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as RequestData[];
      setRequests(requestData);
    };

    fetchRequests();
    return () => unsubscribe(); // Limpiar el listener al desmontar el componente
  }, []);

  // Mientras se esté cargando la autenticación, no hacer nada (puedes mostrar un loader si lo prefieres)
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirigir si no hay usuario autenticado
  if (!user) {
    router.push("/error");
    return null; // Redirige si no está autenticado
  }

  // Function to reject a user (delete from "request" and Firebase Auth)
  const handleReject = async (uid: string) => {
    try {
      // Delete from the "request" collection
      await deleteDoc(doc(db, "request", uid));
      setRequests(requests.filter((request) => request.uid !== uid));

      // Delete user from Firebase Auth
      const user = await auth.getUser(uid); // If you have the permissions
      if (user) await deleteUser(user);
      
      Swal.fire({
        icon: "success",
        title: "User rejected",
        text: "User rejected successfully.",
      });
    } catch (error) {
      console.error("Error rejecting user:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not reject user. Check permissions.",
      });
    }
  };

  // Function to accept a user (move from "request" to "drivers")
  const handleAccept = async (uid: string) => {
    try {
      // Find the user in the local state
      const request = requests.find((request) => request.uid === uid);
      if (!request) {
        Swal.fire({
          icon: "warning",
          title: "User not found",
          text: "User not found.",
        });
        return;
      }

      // Create a new document in the "drivers" collection
      await setDoc(doc(db, "drivers", uid), {
        name: request.name,
        lastname: request.lastname,
        email: request.email,
        Password: request.password,
        phoneNumber: request.phoneNumber,
        profileImage: request.profileImage,
        createdAt: new Date(),
      });

      // Create a new document in the "users" collection
      await setDoc(doc(db, "users", uid), {
        name: request.name,
        lastname: request.lastname,
        email: request.email,
        Password: request.password,
        phoneNumber: request.phoneNumber,
        profileImage: request.profileImage,
        createdAt: new Date(),
        role: "driver",
      });

      // Delete the document from "request"
      await deleteDoc(doc(db, "request", uid));
      setRequests(requests.filter((request) => request.uid !== uid));

      Swal.fire({
        icon: "success",
        title: "User accepted",
        text: `User with UID ${uid} accepted and moved to 'drivers'.`,
      });
    } catch (error) {
      console.error("Error accepting user:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not accept user.",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-3 min-h-screen">
      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-screen text-center">
          <Image
            src={desertImage}
            alt="Desert"
            className="w-1/2 mb-4" // Ajusta el ancho según sea necesario
          />
          <p className="text-xl text-gray-600">No requests at the moment.</p>
        </div>
      ) : (
        requests.map((request) => (
          <div
            key={request.uid}
            className="relative max-w-sm rounded-lg shadow-lg bg-white text-left overflow-hidden"
          >
            <img
              src={request.profileImage}
              alt={`${request.name} ${request.lastname}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-800">
                {request.name} {request.lastname}
              </h3>
              <p className="text-gray-600">
                <strong>Email:</strong> {request.email}
              </p>
              <p className="text-gray-600">
                <strong>Phone:</strong> {request.phoneNumber}
              </p>
            </div>
            <div className="flex justify-between px-5 pb-5">
              <button
                className="py-2 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700"
                onClick={() => handleAccept(request.uid)}
              >
                Accept
              </button>
              <button
                className="py-2 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700"
                onClick={() => handleReject(request.uid)}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RequestsList;

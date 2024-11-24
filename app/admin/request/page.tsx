"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "@techconnect /src/database/firebaseConfiguration";
import { deleteUser } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SettingsLoader from "@techconnect /src/components/settingsLoader";
import Swal from "sweetalert2"; // Import SweetAlert2

interface RequestData {
  uid: string;
  name: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  profileImage: string;
  hashedPassword: string;
}
const RequestsList: React.FC = () => {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // Estado que puede ser null, true o false
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const router = useRouter();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "request"));
        const requestData: RequestData[] = querySnapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        })) as RequestData[];
        setRequests(requestData);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false); // Se establece loading a false después de que se termine la carga
      }
    };

    // Verificar si el usuario logueado es un admin
    const checkAdmin = async (userUid: string) => {
      const adminDoc = doc(db, "admin", userUid);
      const adminSnapshot = await getDoc(adminDoc); // Usamos getDoc para un único documento
      if (adminSnapshot.exists()) {
        setIsAdmin(true); // Si el documento existe, es admin
      } else {
        setIsAdmin(false); // Si no existe, no es admin
      }
    };

    // Detectar el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await checkAdmin(user.uid);
      } else {
        setIsAdmin(false); // Si no está logueado, no es admin
      }
    });

    fetchRequests();

    // Limpiar el observer de autenticación
    return () => unsubscribe();
  }, []);

  // Si el estado de isAdmin es null o loading es true, mostramos el loader
  if (isAdmin === null || loading) {
    return <SettingsLoader />; // Muestra el loader mientras se carga
  }

  // Si no es admin, redirigir a la página de error
  if (isAdmin === false) {
    router.push("/error");
    return <SettingsLoader />;
  }

  // Function to reject a request (remove document from "request" collection and user from Firebase Auth)
  const handleReject = async (uid: string) => {
    try {
      // Remove from the "request" collection
      await deleteDoc(doc(db, "request", uid));

      // Remove user from Firebase Auth
      const user = await auth.getUser(uid); // Ensure this user has the permissions
      if (user) await deleteUser(user);
      alert("User rejected successfully.");
    } catch (error) {
      console.error("Error rejecting user:", error);
      alert("Could not reject user. Check permissions.");
    }
  };

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

      // Prepare data for 'drivers' collection, omitting the password
      const driverData = {
        name: request.name,
        lastname: request.lastname,
        email: request.email,
        phoneNumber: request.phoneNumber,
        profileImage: request.profileImage,
        createdAt: new Date(),
      };

      // Create a new document in the "drivers" collection without the password
      await setDoc(doc(db, "drivers", uid), driverData);

      // Create a new document in the "users" collection
      await setDoc(doc(db, "users", uid), {
        name: request.name,
        lastname: request.lastname,
        email: request.email,
        phoneNumber: request.phoneNumber,
        profileImage: request.profileImage,
        createdAt: new Date(),
      });

      // Remove the document from "request"
      await deleteDoc(doc(db, "request", uid));

      // Update the requests state correctly using the previous state
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.uid !== uid)
      );

      Swal.fire({
        icon: "success",
        title: "User accepted",
        text: `User with UID ${uid} accepted and moved to 'drivers'.`,
      });
    } catch (error) {
      console.error("Error accepting user:", error);
      alert("Could not accept user.");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-3">
        {requests.map((request) => (
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
        ))}
      </div>
    </div>
  );
};

export default RequestsList;

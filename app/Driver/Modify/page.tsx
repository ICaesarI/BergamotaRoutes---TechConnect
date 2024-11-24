"use client";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@techconnect /src/database/firebaseConfiguration";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Password } from "@mui/icons-material";
import Swal from "sweetalert2";

export default function DriverInfo() {
  const [userData, setUserData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editName, setEditName] = useState(false);
  const [editLastname, setEditLastname] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLastname, setNewLastname] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const { uid } = user;
          const driverDocRef = doc(db, "drivers", uid);
          const driverDoc = await getDoc(driverDocRef);

          if (driverDoc.exists()) {
            const driverData = driverDoc.data();
            if (driverData?.createdAt) {
              driverData.createdAt = new Date(
                driverData.createdAt.seconds * 1000
              ).toLocaleString();
            }
            setUserData(driverData);
            setNewName(driverData?.name || "");
            setNewLastname(driverData?.lastname || "");
            setNewEmail(user.email || "");
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

  const handleUpdateRequest = async () => {
    const user = auth.currentUser;

    // Actualizamos el documento del conductor con nueva información
    const driverDocRef = doc(db, "request", user.uid);

    // Primero, actualizamos los campos generales (nombre, apellido, etc.)
    await setDoc(
      driverDocRef,
      {
        name: newName,
        lastname: newLastname,
        email: newEmail,
        password: newPassword,
        updatedAt: new Date(),
        profileImage: previewImage,
        status: "update",
      },
      { merge: true } // Esto garantiza que no sobrescribimos otros campos no mencionados
    );

    // Si la imagen de perfil es nueva, la subimos
    if (previewImage) {
      await setDoc(
        driverDocRef,
        {
          profileImage: previewImage, // Asegúrate de que previewImage sea una URL o base64
        },
        { merge: true } // Solo actualiza el campo profileImage sin afectar los demás
      );
    }

    // Restablecemos el estado de los formularios
    setIsUpdated(false);
    setEditName(false);
    setEditLastname(false);
    setEditEmail(false);
    setEditPassword(false);
  };

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
        setIsUpdated(true); // Marcar que se ha actualizado la imagen
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
    setIsUpdated(true);
  };

  const handleLastnameChange = (e) => {
    setNewLastname(e.target.value);
    setIsUpdated(true);
  };

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
    setIsUpdated(true);
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    setIsUpdated(true);
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
        Edit Your Information
      </h1>
      <div className="flex items-center max-w-md mx-auto justify-between m-2">
        <Link
          href="/Driver"
          className="bg-white text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group"
          type="button"
        >
          <div className="bg-green-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
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
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div className="flex flex-col justify-center items-center relative">
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <div
            className="w-40 h-40 rounded-full border border-gray-300 relative group cursor-pointer"
            onClick={handleImageClick}
          >
            <img
              src={previewImage || userData?.profileImage || "/placeholder.jpg"}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8"
              >
                <path
                  fillRule="evenodd"
                  d="M12 4.5a.75.75 0 0 1 .75.75v6h6a.75.75 0 0 1 0 1.5h-6v6a.75.75 0 0 1-1.5 0v-6h-6a.75.75 0 0 1 0-1.5h6v-6A.75.75 0 0 1 12 4.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold">
              {userData?.name || "No Name"}
            </h2>
            <p className="text-gray-600">{userData?.email || "No Email"}</p>
          </div>
        </div>
        <hr />
        {["Name", "Lastname", "Email", "Password"].map((field, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row justify-between items-center"
          >
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{field}</p>
              {eval(`edit${field}`) ? (
                <input
                  type={field === "Password" ? "password" : "text"}
                  value={eval(`new${field}`)}
                  onChange={eval(`handle${field}Change`)}
                  className="border rounded p-2 w-full"
                />
              ) : (
                <p className="text-gray-600">
                  {userData?.[field.toLowerCase()]}
                </p>
              )}
            </div>
            <button
              onClick={() => eval(`setEdit${field}(!edit${field})`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-2 sm:mt-0"
            >
              {eval(`edit${field}`) ? "Cancel" : "Edit"}
            </button>
          </div>
        ))}
        <div className="text-center">
          <button
            onClick={handleUpdateRequest}
            disabled={!isUpdated}
            className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

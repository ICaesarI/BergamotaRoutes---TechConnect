"use client";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  updateEmail,
} from "firebase/auth";
import {
  db,
  auth,
  storage,
} from "@techconnect /src/database/firebaseConfiguration";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Password } from "@mui/icons-material";
import Swal from "sweetalert2";
import adminIcon from "@techconnect /src/img/adminIcon.png";

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
          const driverDocRef = doc(db, "admin", uid);
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result); // Establece la imagen base64 para la previsualización
        setIsUpdated(true); // Marca que la imagen ha sido modificada
      };
      reader.readAsDataURL(file); // Lee la imagen y la convierte en base64
    }
  };

  const handleUpdateRequest = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.error("No user is logged in.");
      return;
    }

    try {
      // Actualizamos los datos del conductor en Firestore
      const driverDocRef = doc(db, "admin", user.uid);

      await setDoc(
        driverDocRef,
        {
          name: newName,
          lastname: newLastname,
          email: newEmail, // Actualizamos el correo electrónico en Firestore
          updatedAt: new Date(),
        },
        { merge: true }
      );

      // Si el correo electrónico ha cambiado, lo actualizamos en Firebase Auth
      if (newEmail && newEmail !== user.email) {
        await updateEmail(user, newEmail); // Actualizamos el correo electrónico en Firebase Auth
      }

      // Si la contraseña ha cambiado, la actualizamos en Firebase Auth
      if (newPassword) {
        await updatePassword(user, newPassword); // Actualizamos la contraseña en Firebase Auth
      }

      // Si la imagen de perfil ha cambiado, la subimos a Firebase Storage
      if (previewImage && previewImage.startsWith("data:image")) {
        const response = await fetch(previewImage);
        const blob = await response.blob();
        const storageRef = ref(
          storage,
          `adminProfilePictures/${user.uid}/${new Date().toISOString()}`
        );
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Error uploading image:", error);
          },
          async () => {
            // Aquí se corrige el error, se usa 'snapshot.ref' sin los paréntesis
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateDoc(driverDocRef, {
              profileImage: downloadURL,
            });

            setUserData((prevData) => ({
              ...prevData,
              profileImage: downloadURL,
            }));
          }
        );
      }

      // Restablecemos el estado de los formularios
      setIsUpdated(false);
      setEditName(false);
      setEditLastname(false);
      setEditEmail(false);
      setEditPassword(false);
      router.push("/");
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
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
      <div className="flex justify-center mb-6">
        <a
          href="/Driver"
          className="bg-green-500 text-white rounded-full px-6 py-3 font-medium text-lg hover:bg-green-600 transition"
        >
          <span className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              className="w-5 h-5"
            >
              <path
                d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                fill="currentColor"
              ></path>
              <path
                d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                fill="currentColor"
              ></path>
            </svg>
            Go Back
          </span>
        </a>
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
              src={previewImage || userData?.profileImage || adminIcon}
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
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-800">Name</p>
            {editName ? (
              <input
                type="text"
                value={newName}
                onChange={handleNameChange}
                className="border rounded p-2"
              />
            ) : (
              <p className="text-gray-600">{userData?.name}</p>
            )}
          </div>
          <button
            onClick={() => setEditName(!editName)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {editName ? "Cancel" : "Edit"}
          </button>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-800">Lastname</p>
            {editLastname ? (
              <input
                type="text"
                value={newLastname}
                onChange={handleLastnameChange}
                className="border rounded p-2"
              />
            ) : (
              <p className="text-gray-600">{userData?.lastname}</p>
            )}
          </div>
          <button
            onClick={() => setEditLastname(!editLastname)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {editLastname ? "Cancel" : "Edit"}
          </button>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-800">Email</p>
            {editEmail ? (
              <input
                type="email"
                value={newEmail}
                onChange={handleEmailChange}
                className="border rounded p-2"
              />
            ) : (
              <p className="text-gray-600">{userData?.email}</p>
            )}
          </div>
          <button
            onClick={() => setEditEmail(!editEmail)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {editEmail ? "Cancel" : "Edit"}
          </button>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-800">Password</p>
            {editPassword ? (
              <input
                type="password"
                value={newPassword}
                onChange={handlePasswordChange}
                className="border rounded p-2"
              />
            ) : (
              <p className="text-gray-600">********</p>
            )}
          </div>
          <button
            onClick={() => setEditPassword(!editPassword)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {editPassword ? "Cancel" : "Edit"}
          </button>
        </div>
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

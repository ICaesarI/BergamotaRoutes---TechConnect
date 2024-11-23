import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../database/firebaseConfiguration";
import Swal from "sweetalert2";  // Importar sweetalert2

export async function signInUser(email: string, password: string) {
  try {
    // Validación de entrada
    if (!email || !password) {
      throw new Error("El correo y la contraseña son obligatorios.");
    }

    // Autenticar al usuario
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("Usuario autenticado con UID:", user.uid);

    // Verificar el documento en Firestore
    const userDocRef = doc(db, "users", user.uid);
    console.log("UID: " + user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error(
        "Tu cuenta no tiene permisos para acceder. Contacta al administrador."
      );
    }

    console.log("Documento de usuario encontrado:", userDoc.data());

    return { user, userData: userDoc.data() };
  } catch (error: any) {
    // Verificar el tipo de error y mostrar un mensaje adecuado
    let errorMessage = "Error al iniciar sesión."; // Mensaje por defecto

    if (error instanceof Error) {
      errorMessage = 'error.message || error.code || errorMessage'; // Mostrar el mensaje del error si existe
    } else if (error && error.code) {
      errorMessage = error.code; // Si hay un código de error, mostrarlo
    }

    // Mostrar el mensaje de error con Swal
    Swal.fire({
      icon: "error",
      title: "Error",
      text: errorMessage,
      confirmButtonText: "OK"
    });

    // Re-throw para propagar el error si es necesario
    throw new Error(errorMessage);
  }
}

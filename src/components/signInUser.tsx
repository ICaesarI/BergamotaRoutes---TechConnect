import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../database/firebaseConfiguration";

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

    // if (!user.emailVerified) {
    //   throw new Error(
    //     "Por favor, confirma tu correo electrónico antes de continuar."
    //   );
    // }

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
    console.error("Error al iniciar sesión:", error.message || error.code);
    throw new Error(error.message || "Error al iniciar sesión.");
  }
}

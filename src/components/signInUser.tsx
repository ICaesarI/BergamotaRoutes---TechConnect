import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../database/firebaseConfiguration";

export async function signInUser(email: string, password: string) {
  try {
    // Inicia sesión con Firebase Auth
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Verifica si el correo está confirmado
    if (!user.emailVerified) {
      throw new Error(
        "Por favor, confirma tu correo electrónico antes de continuar."
      );
    }

    // Verifica si el usuario existe en la colección `users`
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error(
        "Tu cuenta no tiene permisos para acceder. Contacta al administrador."
      );
    }

    // Si todo está bien, regresa el usuario autenticado
    return user;
  } catch (error) {
    throw new Error(error.message || "Error al iniciar sesión.");
  }
}

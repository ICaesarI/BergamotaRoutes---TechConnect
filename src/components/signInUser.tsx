import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../database/firebaseConfiguration";

export async function signInUser(email: string, password: string) {
  // Validate input
  if (!email || !password) {
    return { success: false, message: "Email and password are required." };
  }

  try {
    // Authenticate the user
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Check user document in Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return {
        success: false,
        message:
          "Your account does not have access permissions. Please contact the administrator.",
      };
    }

    return {
      success: true,
      user,
      userData: userDoc.data(),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred during sign-in.",
    };
  }
}

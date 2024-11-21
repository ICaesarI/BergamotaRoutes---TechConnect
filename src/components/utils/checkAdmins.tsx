// utils/checkAdmin.js
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@techconnect /src/database/firebaseConfiguration";

export const checkAdmin = async (userUid) => {
  const userRef = doc(db, "admin", userUid); // 'users' es la colección de tus usuarios
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return true;
  }
  return false;
};

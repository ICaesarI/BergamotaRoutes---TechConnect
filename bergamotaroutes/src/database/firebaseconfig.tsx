import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBu7ctILqC9qxq88kSBzrNtKUpJd3nvduI",
  authDomain: "bergamotaroutes-fd541.firebaseapp.com",
  projectId: "bergamotaroutes-fd541",
  storageBucket: "bergamotaroutes-fd541.appspot.com",
  messagingSenderId: "679899899952",
  appId: "1:679899899952:web:53189cdd1c9ccb1a49e5f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {db, auth, storage};

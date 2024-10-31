import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBEPi427QUL5dWHcoPRaiv5wyfizPfRSbM",
  authDomain: "bergamotaroutes-cf66b.firebaseapp.com",
  projectId: "bergamotaroutes-cf66b",
  storageBucket: "bergamotaroutes-cf66b.appspot.com",
  messagingSenderId: "541328377043",
  appId: "1:541328377043:web:41dc8e0b470c069b200026"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };

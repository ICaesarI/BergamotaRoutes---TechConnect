import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, onAuthStateChanged } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyDgio8VdOEbYglA4zOoCkP3uleS4xzxqLU", // Clave de API web
  authDomain: "bergamotaroutesoficial.firebaseapp.com", // Asegúrate de que este dominio sea correcto
  projectId: "bergamotaroutesoficial", // ID del proyecto
  storageBucket: "bergamotaroutesoficial.appspot.com", // Asegúrate de que este bucket sea correcto
  messagingSenderId: "192843768390", // Número de proyecto
  appId: "1:192843768390:web:41dc8e0b470c069b200026" // Debe ser el correcto
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage, onAuthStateChanged };

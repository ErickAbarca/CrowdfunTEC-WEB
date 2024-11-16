import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage"; // Importar el módulo para Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyA4ikX4fZOr-C3r4ZK5ytIBfq7daPFUsTA",
  authDomain: "crowdfuntec.firebaseapp.com",
  projectId: "crowdfuntec",
  storageBucket: "crowdfuntec.appspot.com",
  messagingSenderId: "644355281372",
  appId: "1:644355281372:web:c9818e61f6aae764ed7f19",
  measurementId: "G-G091J9JD6Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const storage = getStorage(app); // Inicializar Firebase Storage

export default db;

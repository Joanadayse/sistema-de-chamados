import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDoK6oPlJjwtwpaQvPoFoIJd1qv-HGMtIw",
  authDomain: "tickets-e51b4.firebaseapp.com",
  projectId: "tickets-e51b4",
  storageBucket: "tickets-e51b4.firebasestorage.app",
  messagingSenderId: "810060130739",
  appId: "1:810060130739:web:04cfb2c7a69e0e4d0503c6",
  measurementId: "G-B8Y58BLJRR",
};

const firebaseApp=initializeApp(firebaseConfig);
const auth= getAuth(firebaseApp);
const db=getFirestore(firebaseApp);
const storage= getStorage(firebaseApp);

export {auth, db, storage};

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDwY23Px3WbGRJM1KuiDmkfrbwVUAbXvTI",
    authDomain: "trackie-96283.firebaseapp.com",
    projectId: "trackie-96283",
    storageBucket: "trackie-96283.firebasestorage.app",
    messagingSenderId: "606040487619",
    appId: "1:606040487619:web:8a1c594977b601ab8b9476",
    measurementId: "G-9Y5H0C6MBL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

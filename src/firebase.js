// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAj89xPhx-ZmICR0zp0n5gB8vtDsqoV5rE",
  authDomain: "react-714cd.firebaseapp.com",
  projectId: "react-714cd",
  storageBucket: "react-714cd.firebasestorage.app",
  messagingSenderId: "803062544856",
  appId: "1:803062544856:web:17443266f39b5cd2349aad",
  measurementId: "G-LNCSGP7JHL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
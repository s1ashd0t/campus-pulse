// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace this with your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAQXcuW8uwr6hObT7hxk2kl6uf20R1hR_Q",
    authDomain: "campuspulse-d5aa2.firebaseapp.com",
    projectId: "campuspulse-d5aa2",
    storageBucket: "campuspulse-d5aa2.firebasestorage.app",
    messagingSenderId: "259648699753",
    appId: "1:259648699753:web:040a5ea86e8a77c32ed1f8",
    measurementId: "G-LY6C6CPMX8"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
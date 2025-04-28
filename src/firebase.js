
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Replace this with your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoJlcJ84NJl9QK0VwAvgwvxeiQpL6-frI",
  authDomain: "campuspulse-pfw.firebaseapp.com",
  projectId: "campuspulse-pfw",
  storageBucket: "campuspulse-pfw.firebasestorage.app",
  messagingSenderId: "193427768584",
  appId: "1:193427768584:web:b2007c1f458dadd88498bd",
  measurementId: "G-8BHL7V9MCZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
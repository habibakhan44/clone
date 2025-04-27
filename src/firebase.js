import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyArfv1W-wRWtNg374qoHkRGGyaH4CXi3As",
    authDomain: "mytasker-187df.firebaseapp.com",
    projectId: "mytasker-187df",
    storageBucket: "mytasker-187df.firebasestorage.app",
    messagingSenderId: "65872087077",
    appId: "1:65872087077:web:a838f211007a02f49f17cc",
    measurementId: "G-LB8YWEY7FD"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

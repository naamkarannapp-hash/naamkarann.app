
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {"projectId":"naamkarann","appId":"1:359994149198:web:08708de51a6eedbbb8761f","storageBucket":"naamkarann.firebasestorage.app","apiKey":"AIzaSyA9Sj8gNVdgNhABaxGbmYFvmD2PWgnEp7E","authDomain":"naamkarann.firebaseapp.com","messagingSenderId":"359994149198"};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

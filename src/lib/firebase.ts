
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {"apiKey":"API_KEY","authDomain":"PROJECT_ID.firebaseapp.com","projectId":"PROJECT_ID","storageBucket":"PROJECT_ID.appspot.com","messagingSenderId":"SENDER_ID","appId":"APP_ID"};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

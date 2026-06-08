import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAOJMUXm5hNz5xfYSN0oEd7IapBN8aXufg",
  authDomain: "massarek.firebaseapp.com",
  projectId: "massarek",
  storageBucket: "massarek.firebasestorage.app",
  messagingSenderId: "945706396501",
  appId: "1:945706396501:web:b692d82ccfae6b98891ddc",
  measurementId: "G-ZER6FFNXEE",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { analytics };

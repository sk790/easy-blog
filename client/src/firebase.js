// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "easy-blog-f26d9.firebaseapp.com",
  projectId: "easy-blog-f26d9",
  storageBucket: "easy-blog-f26d9.appspot.com",
  messagingSenderId: "1025951658178",
  appId: "1:1025951658178:web:aa938458e5f0d39b7c4b5b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
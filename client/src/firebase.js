// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "easy-blog2-7025c.firebaseapp.com",
  projectId: "easy-blog2-7025c",
  storageBucket: "easy-blog2-7025c.appspot.com",
  messagingSenderId: "190533108595",
  appId: "1:190533108595:web:31997899de2a426cfd3b06",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

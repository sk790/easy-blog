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

// *
// 1
// rules_version = '2';
// 2
// ​
// 3
// Craft rules based on data in your Firestore database
4;
// allow write: if firestore.get(
5;
//    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
6;

// service firebase.storage {
// 7
//   match /b/{bucket}/o {
// 8
//     match /{allPaths=**} {
// 9
//       allow read;
// 10
//       allow write:if
// 11
//       request.resource.contentType.matches('image/.*')
// 12
//     }
// 13
//   }
// 14
// }

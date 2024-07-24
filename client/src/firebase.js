// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: "easy-blog-f26d9.firebaseapp.com",
//   projectId: "easy-blog-f26d9",
//   storageBucket: "easy-blog-f26d9.appspot.com",
//   messagingSenderId: "1025951658178",
//   appId: "1:1025951658178:web:aa938458e5f0d39b7c4b5b"
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "easy-blog-cd8a2.firebaseapp.com",
  projectId: "easy-blog-cd8a2",
  storageBucket: "easy-blog-cd8a2.appspot.com",
  messagingSenderId: "70050918340",
  appId: "1:70050918340:web:dfa1a372a219b53ff53e91",
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

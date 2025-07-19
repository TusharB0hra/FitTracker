// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDDkiJQtQ-XOZzH4UXszrCkOwQ9ijN4QQw",
  authDomain: "fittrack-c69e3.firebaseapp.com",
  projectId: "fittrack-c69e3",
  storageBucket: "fittrack-c69e3.firebasestorage.app",
  messagingSenderId: "934130810280",
  appId: "1:934130810280:web:26614647459cf5576eb19d"
};

// 🔧 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Initialize Auth service
const auth = getAuth(app);

export { app, auth };


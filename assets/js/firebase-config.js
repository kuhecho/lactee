// assets/js/firebase-config.js

// 1. Import the core Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCgtXZAe_-Wj0D4Pd-t2BYAU3E2faUF86M",
  authDomain: "hmbms-f70b5.firebaseapp.com",
  projectId: "hmbms-f70b5",
  storageBucket: "hmbms-f70b5.firebasestorage.app",
  messagingSenderId: "276256441806",
  appId: "1:276256441806:web:2e3db876c0dddbfb37979f",
  measurementId: "G-XD87JGC0MZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export { app, analytics };

console.log("Firebase initialized successfully!");
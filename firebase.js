// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-JBGr121PYbNNn0M0FrbCOTWxkXYutEA",
  authDomain: "mylestonesapp.firebaseapp.com",
  projectId: "mylestonesapp",
  storageBucket: "mylestonesapp.appspot.com",
  messagingSenderId: "1059392742967",
  appId: "1:1059392742967:web:252a8e86b5d612fb3e01b2",
  measurementId: "G-7T2JT0XL59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
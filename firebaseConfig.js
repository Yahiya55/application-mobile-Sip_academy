// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCe-JlpXYF_mEqgVzBupigHjAA4OBQ0JDc",
  authDomain: "sip-academy-b7405.firebaseapp.com", // Mettez le vrai domaine
  projectId: "sip-academy-b7405",
  storageBucket: "sip-academy-b7405.firebasestorage.app",
  messagingSenderId: "591468862802",
  appId: "1:591468862802:android:c9c6e1ca7479cfc79a6e8b",
};

// Initialiser Firebase une seule fois
let app;
let messaging;

try {
  app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
} catch (error) {
  // Si l'app existe déjà, récupérer l'instance existante
  if (error.code === "app/duplicate-app") {
    console.log("Firebase app already initialized");
  } else {
    console.error("Firebase initialization error", error);
  }
}

export { app, messaging };

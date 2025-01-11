// src/firebase/firebaseConfig.ts

import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Asegúrate de que las variables de entorno estén prefijadas con VITE_
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID // Puede ser undefined si no está definido
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Analytics solo si measurementId está definido
if (firebaseConfig.measurementId) {
    getAnalytics(app);
}

// Inicializa Firestore y Auth con la instancia de `app`
const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth }; // Exporta Firestore y Auth para usarlos en el resto de la aplicación

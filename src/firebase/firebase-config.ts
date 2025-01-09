import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { FirebaseOptions, initializeApp } from "firebase/app";


const firebaseConfig: FirebaseOptions = {
 
  apiKey: "AIzaSyD39LOQ6mAps1X5dskUsVeP5Y8zdKcNpME",
  authDomain: "sac-gestor-360.firebaseapp.com",
  projectId: "sac-gestor-360",
  storageBucket: "sac-gestor-360.firebasestorage.app",
  messagingSenderId: "864184043492",
  appId: "1:864184043492:web:ebfd66bed3fd6cb80fe9f1"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDB = getFirestore(firebaseApp);
export const analytics =
  typeof window !== "undefined" ? getAnalytics(firebaseApp) : null;
export const firebaseStorage = getStorage(firebaseApp);

import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyD2DYwR8c3QGeVsLvVBGqhXxyxxiwP52W8",
  authDomain: "tm16projetofinal.firebaseapp.com",
  projectId: "tm16projetofinal",
  storageBucket: "tm16projetofinal.firebasestorage.app",
  messagingSenderId: "445308413687",
  appId: "1:445308413687:web:43153c39c92dae0ff795f2"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
export { db }
  
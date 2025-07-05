import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // 🔁 paste your actual config here
  apiKey: "AIzaSyBcYMvIK7ke6nXeU6Ksjbx7NEIcFVYj328",
  authDomain: "cohort-boze.firebaseapp.com",
  projectId: "cohort-boze",
  storageBucket: "cohort-boze.firebasestorage.app",
  messagingSenderId: "1046687815270",
  appId: "1:1046687815270:web:f9b36bfc6e94d07eb3bfa7",
  measurementId: "G-C382JP6LM9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

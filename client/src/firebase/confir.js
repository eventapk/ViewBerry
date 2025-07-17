// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCDQTS2G3rDXhshh_kWHaNXg9OFMDD_f9A",
  authDomain: "virtual-360-449a8.firebaseapp.com",
  projectId: "virtual-360-449a8",
  storageBucket: "virtual-360-449a8.appspot.com",
  messagingSenderId: "31940434128",
  appId: "1:31940434128:web:bf2e58f80eb6f5fe6066d5",
  measurementId: "G-WL2H465HPC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
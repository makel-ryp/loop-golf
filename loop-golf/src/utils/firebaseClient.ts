import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCD9L5mEJfJcqyHm7BLwhYyUbEkGNKNMgw",
  authDomain: "loop-golf-b7172.firebaseapp.com",
  projectId: "loop-golf-b7172",
  storageBucket: "loop-golf-b7172.firebasestorage.app",
  messagingSenderId: "451577493893",
  appId: "1:451577493893:web:372a56cda48ab94a97acec",
  measurementId: "G-Y5X0S87542"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

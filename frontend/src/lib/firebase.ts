import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC-43L4_No4QDqyjhzMu2sYFgUNJMMc5II",
  authDomain: "netify-e2d80.firebaseapp.com",
  databaseURL: "https://netify-e2d80-default-rtdb.firebaseio.com",
  projectId: "netify-e2d80",
  storageBucket: "netify-e2d80.firebasestorage.app",
  messagingSenderId: "1020574882026",
  appId: "1:1020574882026:web:42ed033ac20e803b52df93",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export default app;

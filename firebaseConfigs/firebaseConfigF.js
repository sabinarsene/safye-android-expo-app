// firebase-config.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfigF = {
  apiKey: "AIzaSyDgSHpILUU3Qz6zhUJQBW-wQ1XKf0BdkKo",
  authDomain: "faces-46608.firebaseapp.com",
  databaseURL: "https://faces-46608-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "faces-46608",
  storageBucket: "faces-46608.appspot.com",
  messagingSenderId: "996379487113",
  appId: "1:996379487113:web:da3ba19d2007ba52590f58"
};

const app = initializeApp(firebaseConfigF, "DatabaseModifier");
const database = getDatabase(app);

export { app, database };

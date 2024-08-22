import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';


// Configurația Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC1r5rp5NBD4jHPIlo3_rEY_eoxFVNMoVs",
  authDomain: "rnapp-decfb.firebaseapp.com",
  projectId: "rnapp-decfb",
  storageBucket: "rnapp-decfb.appspot.com",
  messagingSenderId: "39078577583",
  appId: "1:39078577583:web:028d184517fe9f36a25b5a"
};

// Initialize Firebase if it hasn't been initialized already
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);

  // Initialize Firebase Auth with AsyncStorage persistence
  initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} else {
  app = getApps()[0];
}

// Export Firebase Auth, Firestore and Storage instances
export const FIREBASE_AUTH = getAuth(app);
export const FIREBASE_FIRESTORE = getFirestore(app);
export const FIREBASE_STORAGE = getStorage(app);

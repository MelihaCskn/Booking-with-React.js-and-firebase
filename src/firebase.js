
import { initializeApp } from "firebase/app";
import{getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCM0rq_DUR947FVi1w3rbwfFFqD_d2THdo",
  authDomain: "rezerveet-cc83e.firebaseapp.com",
  projectId: "rezerveet-cc83e",
  storageBucket: "rezerveet-cc83e.appspot.com",
  messagingSenderId: "41433612029",
  appId: "1:41433612029:web:9ba2a085b68ffe89d08894"
};


export const app = initializeApp(firebaseConfig);
export const auth= getAuth(app);
export const db=getFirestore(app);
export const storage = getStorage(app);
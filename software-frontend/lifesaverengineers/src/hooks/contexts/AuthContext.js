import { createContext, useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import firebaseConfig from "../../firebase-config";
export const Context = createContext();

// Create a provider component
export const FirebaseProvider = ({ children }) => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    let unsubscribe;
    unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(false);
      if (currentUser) setUser(currentUser);
      else setUser(null);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);



  const firebaseValue = {
    user: user,
    db: db,
    auth: auth,
    setUser: setUser,
    logOut: logOut,
  };

  return (
    <Context.Provider value={firebaseValue}>
      {!loading && children}
    </Context.Provider>
  );
};

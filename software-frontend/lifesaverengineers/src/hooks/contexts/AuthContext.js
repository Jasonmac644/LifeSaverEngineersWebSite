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
import { getStorage } from "firebase/storage";
import firebaseConfig from "../../firebase-config";
import { getFunctions, httpsCallable } from "firebase/functions";
export const Context = createContext();

// Create a provider component
export const FirebaseProvider = ({ children }) => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const functions = getFunctions(app);
  const provider = new GoogleAuthProvider();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageRef, setImageRef] = useState("");

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


  const fetchUserProfileImage = httpsCallable(functions, "getLatestImage");
	useEffect(() => {
		fetchUserProfileImage(user?.uid)
			.then((e) => {
				setImageRef(e.data.url);
			})
			.catch((e) => {
				console.log(e.code);
			});
	}, []);
  const firebaseValue = {
    user: user,
    db: db,
    auth: auth,
    storage: storage,
    setUser: setUser,
    logOut: logOut,
    app: app,
    imageRef, imageRef,
    setImageRef, setImageRef
  };

  return (
    <Context.Provider value={firebaseValue}>
      {!loading && children}
    </Context.Provider>
  );
};

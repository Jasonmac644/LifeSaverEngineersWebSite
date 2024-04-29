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
  sendEmailVerification,
  updatePhoneNumber,
  signInWithPhoneNumber,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from "../../firebase-config";
import { getFunctions, httpsCallable } from "firebase/functions";
import { Backdrop, CircularProgress, Box } from "@mui/material";
import appColor from "../../styles/colors";

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
    setLoading(true)
    return signOut(auth);
  };
  const verifyEmail = async () => {
    sendEmailVerification(user)
      .then(() => {
        return true;
      })
      .catch((e) => {
        return false;
      });
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
    
    user &&
      fetchUserProfileImage(user?.uid)
        .then((e) => {
          setImageRef(e.data.url);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e.code);
        });
  }, [user]);

  const firebaseValue = {
    user: user,
    db: db,
    auth: auth,
    storage: storage,
    setUser: setUser,
    logOut: logOut,
    app: app,
    imageRef: imageRef,
    setImageRef: setImageRef,
    setLoading: setLoading,
    loading:loading,
    verifyEmail: verifyEmail,
    signInWithPhoneNumber: signInWithPhoneNumber,
  };

  return (
    <Context.Provider value={firebaseValue}>
      {loading ? (
        <Box bgcolor={appColor.ashGreen} width="100vw" height="100vh">
          <Backdrop open={true}>
            <CircularProgress
              sx={{ color: appColor.ashGreenTint }}
            ></CircularProgress>
          </Backdrop>
        </Box>
      ) : (
        children
      )}
    </Context.Provider>
  );
};

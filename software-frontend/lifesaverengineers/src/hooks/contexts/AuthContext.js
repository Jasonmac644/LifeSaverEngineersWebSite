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
import { useNavigate } from "react-router-dom";
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

	//Google Sign In
	const initiateGoogleSignIn = async () => {
		try {
			await signInWithRedirect(auth, provider);
		} catch (error) {
			console.error("Error initiating sign-in with Google:", error);
		}
	};
	const processSignInRedirectResult = async () => {
		try {
			const result = await getRedirectResult(auth);
			if (result) {
				// User signed in successfully
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;
				const user = result.user;
				if (user) {
					return true;
				}
				// Navigate to dashboard or perform other actions
			}
		} catch (error) {
			// Handle errors from the redirect result
			console.error("Error processing redirect result:", error);
			return false;
		}
	};
	const firebaseValue = {
		user: user,
		db: db,
		setUser: setUser,
		logOut: logOut,
		initiateGoogleSignIn: initiateGoogleSignIn,
		processSignInRedirectResult: processSignInRedirectResult,
	};

	return (
		<Context.Provider value={firebaseValue}>
			{!loading && children}
		</Context.Provider>
	);
};

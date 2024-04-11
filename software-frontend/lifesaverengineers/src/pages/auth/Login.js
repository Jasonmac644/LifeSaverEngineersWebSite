import { useState, useContext, useEffect } from "react";
import {
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	getAuth,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import appColor from "../../styles/colors";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";
import { MainLogo } from "../../assets";
import GoogleButton from "react-google-button";
import { Context } from "../../hooks/contexts/AuthContext";

const Login = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const provider = new GoogleAuthProvider();
	const auth = getAuth();
	const { initiateGoogleSignIn, processSignInRedirectResult } =
		useContext(Context);
	const onLogin = (e) => {
		e.preventDefault();
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Signed in
				const user = userCredential.user;
				navigate("/dashboard");
				console.log(user);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage);
			});
	};

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleGoogleSignIn = () => {
		async () => {
			await initiateGoogleSignIn().then(() => {
				processSignInRedirectResult();
			});
		};
	};

	return (
		<Container
			sx={{
				backgroundColor: appColor.gray,
				minHeight: "100vh",
				minWidth: "100%",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
			}}
		>
			<Stack direction={"column"} mb={"10vh"}>
				<img
					src={MainLogo}
					alt="Main Logo"
					height="300px"
					style={{ marginBottom: "40px" }}
				/>
				<FormControl variant="standard">
					{/* <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} /> */}
					<TextField
						required
						id="email"
						label="Email"
						variant="filled"
						value={email}
						onChange={handleEmailChange}
						style={{ marginBottom: "5px" }}
					/>
					<TextField
						required
						id="password"
						label="Password"
						variant="filled"
						type="password"
						onChange={handlePasswordChange}
						value={password}
					/>
				</FormControl>
				<Button sx={{ mt: "20px" }} variant="contained" onClick={onLogin}>
					Login
				</Button>
				<GoogleButton
					type="dark"
					onClick={handleGoogleSignIn}
					style={{ width: "100%", marginTop: "20px" }}
				/>
			</Stack>
		</Container>
	);
};

export default Login;

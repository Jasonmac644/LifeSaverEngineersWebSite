import { useState, useContext, useEffect } from "react";
import {
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	getAuth,
	signInWithRedirect,
	getRedirectResult,
	createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Container, Snackbar } from "@mui/material";
import appColor from "../../styles/colors";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Stack, Badge, IconButton, Grow, Alert } from "@mui/material";
import { MainLogo } from "../../assets";
import GoogleButton from "react-google-button";
import { Context } from "../../hooks/contexts/AuthContext";
import CancelIcon from "@mui/icons-material/Cancel";
const Login = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isVerified, setIsVerified] = useState(false);
	const [emailError, setEmailError] = useState(false);
	const provider = new GoogleAuthProvider();
	const { auth } = useContext(Context);
	const onNext = (e) => {
		e.preventDefault();
		createUserWithEmailAndPassword(auth, email, "123456")
			.then((userCredential) => {
				// If successful, delete the user immediately (not recommended for production)
				const user = userCredential.user;
				user.delete();
				// Handle the new user logic here
				setEmailError(true);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				if (errorCode === "auth/email-already-in-use") {
					setIsVerified(true);
				} else {
					setEmailError(true);
				}
			});
	};
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

	const handleGoogleSignIn = async () => {
		await signInWithRedirect(auth, provider);
	};

	useEffect(() => {
		if (auth) {
			getRedirectResult(auth)
				.then((result) => {
					if (result) {
						navigate("/dashboard");
					}
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}, []);
	const handleEmailError = () => {
		console.log(isVerified);
		if (emailError) {
			return true;
		} else {
			return false;
		}
	};

	function GrowTransition(props) {
		return <Grow {...props} />;
	}
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
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
				open={emailError}
				onClose={() => setEmailError(false)}
				autoHideDuration={2000}
			>
				<Alert
					onClose={() => setEmailError(false)}
					severity="error"
					variant="filled"
					sx={{ width: "100%" }}
				>
					Email is not valid
				</Alert>
			</Snackbar>
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
						error={handleEmailError()}
						onChange={handleEmailChange}
						style={{ marginBottom: "5px" }}
						disabled={isVerified}
						sx={{
							"& input:-webkit-autofill": {
								WebkitBoxShadow: `0 0 0 1000px #9ea792 inset !important`,
								WebkitTextFillColor: "black !important",
							},
						}}
					/>

					{isVerified && (
						<Stack direction={"row"} position={"relative"}>
							<IconButton
								sx={{
									height: "24px",
									width: "24px",
									position: "absolute",
									right: "-30px",
									top: "12px",
								}}
								onClick={() => setIsVerified(!isVerified)}
							>
								<CancelIcon />
							</IconButton>
							<TextField
								required
								id="password"
								label="Password"
								variant="filled"
								type="password"
								onChange={handlePasswordChange}
								value={password}
							/>
						</Stack>
					)}
				</FormControl>
				<Button
					sx={{
						mt: "20px",
						bgcolor: appColor.ashGreen,
						"&.MuiButton-root:hover": { bgcolor: appColor.ashGreenTint },
					}}
					variant="contained"
					onClick={isVerified ? onLogin : onNext}
				>
					{isVerified ? "Login" : "Next"}
				</Button>
				<GoogleButton
					type="dark"
					onClick={handleGoogleSignIn}
					style={{
						width: "100%",
						marginTop: "20px",
						backgroundColor: appColor.ashGreen,
					}}
				/>
			</Stack>
		</Container>
	);
};

export default Login;

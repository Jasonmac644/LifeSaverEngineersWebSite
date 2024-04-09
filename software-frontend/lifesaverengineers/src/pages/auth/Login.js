import {  useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getAuth
} from "firebase/auth";
import {useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import appColor from "../../styles/colors";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";
import { MainLogo } from "../../assets";
import GoogleButton from "react-google-button";



const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
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

  //Google Sign In
  const onGoogleSignIn = (e) => {
    e.preventDefault();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
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
            id="filled-hidden-label-small"
            label="Email"
            variant="filled"
            value={email}
            onChange={handleEmailChange}
            style={{ marginBottom: "5px" }}
          />
          <TextField
            required
            id="filled-hidden-label-small"
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
        <GoogleButton type="dark" onClick={onGoogleSignIn} style={{width:"100%", marginTop:"20px"}}/>
      </Stack>
    </Container>
  );
};

export default Login;

import { useState, useContext } from "react";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateEmail,
  verifyBeforeUpdateEmail,
  reload
} from "firebase/auth";
import { Box, Backdrop } from "@mui/material";
import appColor from "../../styles/colors";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";
import { MainLogo } from "../../assets";
import { Context } from "../../hooks/contexts/AuthContext";
import { AlertBox } from "../../components/common";
import CircularProgress from "@mui/material/CircularProgress";
const ReAuthPage = ({ children, newEmail, handler, a, setinfo, info }) => {
  const [password, setPassword] = useState("");
  const { user } = useContext(Context);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [backdrop, setBackdrop] = useState(false);

  const updateAndVerifyEmail = async (currentUser, email) => {
    await verifyBeforeUpdateEmail(user, email)
      .then(() => {
        reload(user)
        setBackdrop(false);
        a(!alert);
        setinfo({
          ...info,
          message: "Email has heen sent for verification",
          messageType: "success",
        });
        handler(false);
      })
      .catch((e) => {
        console.log(e);
        setBackdrop(false);
      });
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onLogin = async (e) => {
    e.preventDefault();
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential)
      .then(() => {
        setBackdrop(!backdrop);
        updateAndVerifyEmail(user, newEmail);
      })
      .catch((e) => {
        console.log(e);
        setAlert(!alert);
        setAlertMessage("Invalid Password");
        setAlertType("error");
      });
  };

  return (
    <Box
      sx={{
        backgroundColor: appColor.gray,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        px: "10px",
      }}
    >
      <Backdrop sx={{ color: "#fff" }} open={backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <AlertBox
        handler={setAlert}
        state={alert}
        type={alertType}
        message={alertMessage}
      ></AlertBox>
      <Box style={{ display: "flex", width: "100%", justifyContent: "end" }}>
        {children}
      </Box>

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
            value={user.email}
            disabled
            style={{ marginBottom: "5px" }}
            sx={{
              "& input:-webkit-autofill": {
                WebkitBoxShadow: `0 0 0 1000px #9ea792 inset !important`,
                WebkitTextFillColor: "black !important",
              },
            }}
          />

          <Stack direction={"row"} position={"relative"}>
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
        </FormControl>
        <Button
          sx={{
            mt: "20px",
            bgcolor: appColor.ashGreen,
            "&.MuiButton-root:hover": { bgcolor: appColor.ashGreenTint },
          }}
          variant="contained"
          onClick={onLogin}
        >
          {"Login"}
        </Button>
      </Stack>
    </Box>
  );
};

export default ReAuthPage;

import { useContext, useEffect, useState, useRef } from "react";
import {
  Box,
  Stack,
  useMediaQuery,
  Avatar,
  Fab,
  Modal,
  Typography,
  Slider,
  Button,
  FilledInput,
  OutlinedInput,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Context } from "../hooks/contexts/AuthContext";
import appColor from "../styles/colors";
import EditIcon from "@mui/icons-material/Edit";
import AvatarEditor from "react-avatar-editor";
import { ref, uploadBytes } from "firebase/storage";
import {
  updateProfile,
  updateEmail,
  sendEmailVerification,
  reauthenticateWithCredential,
} from "firebase/auth";
import { EText } from "../components/common";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { AlertBox } from "../components/common";
import { validators } from "../helpers";
import { ReAuthPage } from "../pages/auth";

const AvatarEditorModal = ({ src, open }) => {
  const { setImageRef, storage, user } = useContext(Context);
  const [slideValue, setSlideValue] = useState(10);
  const cropRef = useRef(null);
  const profileImageRef = ref(storage, `profileImages/${user.uid}/images`);
  const handleSave = async () => {
    if (cropRef.current) {
      const dataUrl = cropRef.current.getImage().toDataURL();

      try {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        await uploadBytes(profileImageRef, blob); // Using uploadBytes instead of put
        setImageRef(src);
        open(false);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    } else {
      console.error("Crop reference is not available.");
    }
  };

  return (
    <Box
      height={300}
      display="flex"
      justifyContent="center"
      flexDirection="column"
    >
      <AvatarEditor
        image={src}
        ref={cropRef}
        width={250}
        height={250}
        border={20}
        borderRadius={150}
        color={[255, 255, 255, 0.4]} // RGBA
        scale={slideValue / 10}
        rotate={0}
      />
      <Slider
        min={10}
        max={50}
        sx={{
          margin: "0 auto",
          width: "80%",
          color: appColor.flax,
        }}
        size="medium"
        defaultValue={slideValue}
        value={slideValue}
        onChange={(e) => setSlideValue(e.target.value)}
      />
      <Button onClick={handleSave}>Save</Button>
    </Box>
  );
};

const Profile = () => {
  const { user, imageRef, verifyEmail, signInWithPhoneNumber } =
    useContext(Context);
  const isDesktop = useMediaQuery("(min-width:860px");
  const [uploadImage, setUploadImage] = useState();
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState(null);
  const [editInfo, setEditInfo] = useState(true);
  const [alert, setAlert] = useState(false);
  const [modal, setModal] = useState(false);
  const [info, setInfo] = useState({
    displayName: "",
    email: "",
    phoneNumber: "",
    message: "",
    messageType: "",
    validPhoneNumber: null,
  });
  useEffect(() => {
    setInfo({
      displayName: user.displayName,
      email: user.email,
      phoneNumber: user.phoneNumbe,
    });
  }, []);
  const handleEmailVerification = () => {
    let result = verifyEmail();
    if (result) {
      setAlert(!alert);
      setInfo({
        ...info,
        message: "Verification email has been sent",
        messageType: "success",
      });
    } else {
      setAlert(!alert);
      setInfo({
        ...info,
        message: "Error sending verification email",
        messageType: "error",
      });
    }
  };
  const setDisplayName = async (n) => {
    user.displayName !== n &&
      (await updateProfile(user, { displayName: n })
        .then(() => {
          setAlert(!alert);
          setInfo({
            ...info,
            message: "Successfully Updated Information",
            messageType: "success",
          });
        })
        .catch((e) => {
          setAlert(!alert);
          setInfo({
            ...info,
            message: "There was an error",
            messageType: "error",
          });
          setEditInfo(!editInfo);
        }));
  };
  const handleEdit = () => {
    setEditInfo(!editInfo);
  };

  const handleSave = () => {
    setDisplayName(info.displayName).then(() => {
      setEditInfo(!editInfo);
    });
    info.email !== user.email && setModal(true);
  };

  const handleImageInput = (e) => {
    setSrc(URL.createObjectURL(e.target.files[0]));
    setOpen(true);
  };
  const validatePhoneNumber = (v) => {
    if (validators.ValidatePhoneNumber(v)) {
      setInfo({ ...info, validPhoneNumber: true });
    } else {
      setInfo({ ...info, validPhoneNumber: false });
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: appColor.kaki,
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const inputRef = useRef(null);
  return (
    <Stack
      direction={!isDesktop ? "column" : "row"}
      sx={{ justifyContent: "center", height: "100vh", px: "30px" }}
    >
      <Modal
        open={modal}
        onClose={(e) => {
          console.log(e);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ height: "70%", alignSelf: "center" }}
      >
        <Box sx={style}>
          <ReAuthPage
            user={user}
            handler={setModal}
            state={modal}
            newEmail={info.email}
            a={setAlert}
            setinfo={setInfo}
            info={info}
          >
            <IconButton
              onClick={() => setModal(!modal)}
              sx={{
                width: "23px",
                height: "23px",
                justifySelf: "end",
                right: -10,
              }}
            >
              <ClearIcon sx={{ width: "20px", height: "20px" }} />
            </IconButton>
          </ReAuthPage>
        </Box>
      </Modal>
      <AlertBox
        state={alert}
        message={info.message}
        handler={setAlert}
        type={info.messageType}
      />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AvatarEditorModal src={src} open={setOpen} />
        </Box>
      </Modal>
      <Box
        height={"400px"}
        flex={1}
        bgcolor={appColor.kaki}
        sx={{
          borderRadius: "20px",
          m: "20px",
          display: "flex",
          justifyContent: "center",
          padding: "20px",
          flexDirection: "column",
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          height="min-content"
          alignItems="end"
        >
          <Fab
            style={{
              position: "absolute",
              backgroundColor: appColor.kaki,
              width: 35,
              height: 30,
            }}
            onClick={() => inputRef.current.click()}
          >
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              onChange={handleImageInput}
              hidden
            ></input>
            <EditIcon sx={{ width: 20, height: 20 }} />
          </Fab>

          <Avatar
            src={imageRef}
            alt="Main Logo"
            sx={{ width: 150, height: 150, my: "20px" }}
          />
        </Box>
        <Stack direction={"row"} sx={{ alignSelf: "end", mt: "20px" }}>
          {editInfo ? (
            <Button
              onClick={handleEdit}
              sx={{ width: "min-content", height: "30px", color: "black" }}
            >
              <EText type="r10">Edit </EText>
              <EditIcon sx={{ pl: "5px", width: "15px", height: "15px" }} />
            </Button>
          ) : (
            <Button
              sx={{
                alignSelf: "end",
                width: "min-content",
                height: "30px",
                color: "black",
              }}
              onClick={handleSave}
            >
              <EText type="r10">Save </EText>
              <CheckIcon sx={{ pl: "5px", width: "20px", height: "20px" }} />
            </Button>
          )}
        </Stack>

        <OutlinedInput
          sx={{ height: "40px", mb: "5px" }}
          defaultValue={user.displayName}
          disabled={editInfo}
          onChange={(e) => setInfo({ ...info, displayName: e.target.value })}
        />
        {!user.emailVerified && (
          <EText type="r10">
            Email is not verified,{" "}
            <a
              style={{
                userSelect: "none",
                cursor: "pointer",
                display: "contents",
                color: "white",
              }}
              onClick={handleEmailVerification}
            >
              <EText type="r10" style={{ display: "contents" }}>
                Click here to verify
              </EText>
            </a>
          </EText>
        )}
        <OutlinedInput
          sx={{
            height: "40px",
            my: "5px",
          }}
          defaultValue={user?.email}
          disabled={
            editInfo || user?.providerData[0]?.providerId === "google.com"
          }
          onChange={(v) =>
            validators.ValidateEmail(v.target.value) &&
            setInfo({ ...info, email: v.target.value })
          }
          error={!validators.ValidateEmail(info.email)}
          endAdornment={
            user.emailVerified ? (
              <Tooltip
                title={
                  user?.providerData[0]?.providerId === "google.com"
                    ? "Verified Google Account"
                    : "Your email is verified"
                }
                placement="right-start"
                PopperProps={{
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, 10],
                      },
                    },
                  ],
                }}
                slotProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: "green",
                      "& .MuiTooltipPlacementRight": { ml: "20px" },
                    },
                  },
                }}
              >
                <CheckIcon
                  width="10px"
                  sx={{
                    color: "green",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.2)" },
                    borderRadius: "15px",
                  }}
                />
              </Tooltip>
            ) : (
              <Tooltip
                title="Your email is not verified"
                placement="right-start"
                slotProps={{
                  tooltip: {
                    sx: { backgroundColor: "red" },
                  },
                }}
              >
                <ClearIcon width="10px" sx={{ color: "red" }} />
              </Tooltip>
            )
          }
        />
        <OutlinedInput
          sx={{ height: "40px", my: "5px" }}
          placeholder={!user.phoneNumber && "Enter a Phone Number"}
          defaultValue={user.phoneNumber && user.phoneNumber}
          disabled={editInfo}
          error={info.validPhoneNumber !== undefined && !info.validPhoneNumber}
          onChange={(e) => {
            validatePhoneNumber(e.target.value);
          }}
        />
      </Box>
      <Box
        height={"400px"}
        flex={1}
        bgcolor={appColor.kaki}
        sx={{
          borderRadius: "20px",
          m: "20px",
          display: "flex",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        2
      </Box>
      <Box
        height={"400px"}
        flex={1}
        bgcolor={appColor.kaki}
        sx={{
          borderRadius: "20px",
          m: "20px",
          display: "flex",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        3
      </Box>
    </Stack>
  );
};

export default Profile;

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
} from "@mui/material";
import { Context } from "../hooks/contexts/AuthContext";
import appColor from "../styles/colors";
import EditIcon from "@mui/icons-material/Edit";
import AvatarEditor from "react-avatar-editor";
import { ref, uploadBytes } from "firebase/storage";
const AvatarEditorModal = ({src, open}) => {
  const { setImageRef, storage, user } = useContext(Context);
  const [slideValue, setSlideValue] = useState(10);
  const cropRef = useRef(null);
  const profileImageRef = ref(storage, `profileImages/${user.uid}/images`);
  console.log(profileImageRef);
  const handleSave = async () => {
    if (cropRef.current) {
      const dataUrl = cropRef.current.getImage().toDataURL();

      try {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        await uploadBytes(profileImageRef, blob); // Using uploadBytes instead of put
        setImageRef(src)
        open(false)
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
  const { user, imageRef } = useContext(Context);
  const isDesktop = useMediaQuery("(min-width:860px");
  const [uploadImage, setUploadImage] = useState();
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState(null);

  const handleImageInput = (e) => {
    setSrc(URL.createObjectURL(e.target.files[0]));
    setOpen(true);
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
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AvatarEditorModal src={src} open={setOpen}/>
        </Box>
      </Modal>
      <Box
        height={"350px"}
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
            sx={{ width: 150, height: 150, mb: "15px" }}
          />
        </Box>
      </Box>
      <Box
        height={"350px"}
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
        height={"350px"}
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

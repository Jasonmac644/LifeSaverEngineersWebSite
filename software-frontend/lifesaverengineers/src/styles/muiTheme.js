import { createTheme } from "@mui/material/styles";
import appColor from "./colors";
const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          color: "red",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: appColor.ashGreenTint,
          },
          ":hover": {
            backgroundColor: appColor.ashGreenTint,
          },
          "&.Mui-selected:hover": {
            backgroundColor: appColor.ashGreenTint,
          },
        },
      },
    },
    
  },
});

export default theme;

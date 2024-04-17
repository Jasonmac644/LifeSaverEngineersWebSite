import { createTheme } from "@mui/material/styles";
import appColor from "./colors";
const theme = createTheme({
	typography: {},
	components: {
		MuiTextField: {
			styleOverrides: {
				root: {
					color: "black",
					width: "100%",
				},
			},
		},

		MuiFilledInput: {
			styleOverrides: {
				root: {
					"&:focused": {
						backgroundColor: "rgba(0,0,0,0.6)",
					},
					"&::after": {
						borderBottom: `2px solid ${appColor.ashGreenTint}`,
					},
				},
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					"&.Mui-focused": { color: "black" },
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
		MuiPickersDay: {
			styleOverrides: {
				root: {
					"&.Mui-selected.Mui-selected": {
						backgroundColor: appColor.fawn,
						"&:hover": {
							backgroundColor: "#ff8787",
						},
					},
				},
			},
		},
	},
});

export default theme;

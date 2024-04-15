import {
	List,
	Divider,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Box,
	Stack,
	Drawer,
} from "@mui/material";
import { MainLogo } from "../assets";
import appColor from "../styles/colors";
import { EText } from "./common";
import React, { useContext, useEffect } from "react";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { Outlet, useNavigate, useLocation, useLinkClickHandler } from "react-router-dom";
import { Context } from "../hooks/contexts/AuthContext";
import { Dashboard } from "../containers";
const DrawerList = ({ drawerWidth }, ...props) => {
	const navigate = useNavigate();
	const curLocation = useLocation();
	const { logOut } = useContext(Context);

	//If user ever decides to try and navigate to "/"
	useEffect(() => {
		if (curLocation.pathname === "/") {
			navigate("/dashboard");
		}
		return () => {};
	}, [curLocation, navigate]);

	//Signout
	const handleSignOut = () => {
		logOut()
			.then(() => {
				navigate("/login");
			})
			.catch((error) => console.error(error));
	};
	const menuItems = [
		{ text: "Dashboard", icon: <DashboardCustomizeIcon />, path: "/dashboard" },
		{ text: "Profile", icon: <AccountCircleIcon />, path: "/profile" },
		// { text: "Profile", icon: <DashboardCustomizeIcon />, path: "/profile" },
		// { text: "Drafts", icon: <AccountCircleIcon />, path: "/drafts" },
	];
	return (
		<Box
			sx={{
				width: drawerWidth,
				display: "flex",
				flexDirection: "column",
				bgcolor: appColor.ashGreen,
			}}
			height="100%"
		>
			<Stack
				pl="15px"
				pt="10px"
				direction="row"
				sx={{ alignItems: "center", cursor: "pointer" }}
			>
				<img src={MainLogo} alt="Main Logo" height="35px" width="35px" />
				<EText style={{ paddingLeft: "10px" }} type="b18">
					LifeSaverEngineers
				</EText>
			</Stack>
			<Divider sx={{ my: "10px" }} />
			<Box sx={{ flexGrow: 1 }}>
				<List>
					{menuItems.map((item, index) => (
						<ListItem key={item.text} disablePadding sx={{ height: "41px" }}>
							<ListItemButton
								selected={curLocation.pathname === item.path}
								sx={{
									height: "40px",
									borderRadius: "20px",
									marginX: "10px",
									pl: "10px",
								}}
								onClick={() => navigate(item.path)}
							>
								<ListItemIcon sx={{ minWidth: 30, paddingRight: "10px" }}>
									{React.cloneElement(item.icon, { sx: { height: "25px" } })}
								</ListItemIcon>
								<ListItemText primary={<EText type="B16">{item.text}</EText>} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Box>
			<Divider />
			<List>
				<ListItem key={"Logout"} disablePadding sx={{ height: "40px" }}>
					<ListItemButton
						sx={{
							height: "40px",
							borderRadius: "20px",
							marginX: "10px",
							pl: "10px",
						}}
						onClick={() => {
							handleSignOut();
						}}
					>
						<ListItemIcon sx={{ minWidth: 30, paddingRight: "5px" }}>
							<LogoutOutlinedIcon sx={{ height: "25px" }} />
						</ListItemIcon>
						<ListItemText primary={<EText type="b18">Logout</EText>} />
					</ListItemButton>
				</ListItem>
			</List>
		</Box>
	);
};

const Layout = ({ children, ...props }) => {
	const drawerWidth = "258px";
	const curLocation = useLocation()
	return (
		<Stack direction="row" height="100vh">
			<Drawer
				variant="permanent"
				anchor="left"
				sx={{ width: drawerWidth, "& .MuiDrawer-paper": { borderWidth: 0 } }}
			>
				<DrawerList drawerWidth={drawerWidth} />
			</Drawer>
			<Box flexGrow={1} bgcolor={appColor.ashGreenTint}>
				<Box width="100%" >
					<EText type="B40" style={{color: appColor.kaki, textAlign:"center"}}>
						{curLocation.pathname.toLocaleUpperCase().slice(1,100)}
					</EText>
					<Divider sx={{ my: "10px", borderWidth:"3px" }} />
				</Box>
				{<Outlet /> || <Dashboard />}
			</Box>
		</Stack>
	);
};

export default Layout;

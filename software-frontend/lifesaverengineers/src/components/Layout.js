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
	Avatar,
	useMediaQuery,
	IconButton,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import { MainLogo } from "../assets";
import appColor from "../styles/colors";
import { EText } from "./common";
import React, { useContext, useEffect, useState } from "react";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import {
	Outlet,
	useNavigate,
	useLocation,
	useLinkClickHandler,
} from "react-router-dom";
import { Context } from "../hooks/contexts/AuthContext";
import { Dashboard } from "../containers";
import { getFunctions, httpsCallable } from "firebase/functions";
import toUpperCaseFirstWord from "../helpers";
import { useTheme, styled } from "@mui/material/styles";

const DrawerList = ({ drawerWidth, closeDrawer }, ...props) => {
	const navigate = useNavigate();
	const curLocation = useLocation();
	const { logOut, app, user, imageRef } = useContext(Context);
	
	const functions = getFunctions(app);

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
				bgcolor: appColor.kaki,
			}}
			height="100%"
		>
			<Stack
				direction="row"
				sx={{ alignItems: "center", height: "67px", pl: "10px" }}
			>
				<img src={MainLogo} alt="Main Logo" height="45px" width="45px" />
				<EText style={{ paddingLeft: "10px", cursor: "pointer" }} type="b18">
					LifeSaverEngineers
				</EText>
			</Stack>
			<Divider sx={{ borderWidth: "3px" }} />
			<Box sx={{ flexGrow: 1, alignItems: "center" }}>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						flexDirection: "column",
						py: "20px",
					}}
				>
					<Avatar
						src={imageRef}
						alt="Main Logo"
						sx={{ width: 100, height: 100, mb: "15px" }}
					/>
					<EText type="b18">
						Welcome{" "}
						{user.displayName && toUpperCaseFirstWord(user?.displayName)}
					</EText>
				</Box>
				<Divider sx={{ my: "10px", borderWidth: "3px" }} />
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
								onClick={() => {
									closeDrawer();
									navigate(item.path);
								}}
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
			<Divider sx={{ borderWidth: "3px" }} />
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
	const curLocation = useLocation();
	const matches = useMediaQuery("(min-width:1400px)");
	const theme = useTheme();
	const [open, setOpen] = useState(false);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};
	const DrawerHeader = styled("div")(({ theme }) => ({
		top: 0,
		left: 220,
		position: "fixed",
	}));
	return (
		<Stack direction="row" height="100vh">
			{!matches && (
				<IconButton
					color="inherit"
					aria-label="open drawer"
					onClick={handleDrawerOpen}
					edge="start"
					sx={{ top: 0, position: "fixed", m: "10px" }}
				>
					<MenuIcon />
				</IconButton>
			)}
			<Drawer
				variant={matches ? "permanent" : "persistent"}
				open={open}
				anchor="left"
				sx={{
					width: !matches ? "0" : drawerWidth,
					"& .MuiDrawer-paper": { borderWidth: 0 },
				}}
			>
				{!matches && (
					<DrawerHeader>
						<IconButton onClick={handleDrawerClose}>
							<ChevronLeftIcon />
						</IconButton>
					</DrawerHeader>
				)}
				<DrawerList drawerWidth={drawerWidth} closeDrawer={handleDrawerClose} />
			</Drawer>
			<Box
				flexGrow={1}
				bgcolor={appColor.ashGreenTint}
				width="100%"
				sx={!matches ? { height: "max-content" } : { height: "100vh" }}
			>
				<Box flex={1} bgcolor={appColor.kaki}>
					<EText
						type={matches ? "B40" : "b30"}
						style={{ color: "black", textAlign: "center", paddingTop: "10px" }}
					>
						{curLocation.pathname.toLocaleUpperCase().slice(1, 20)}
					</EText>
					<Divider sx={{ mt: "10px", borderWidth: "3px" }} />
				</Box>
				{<Outlet /> || <Dashboard />}
			</Box>
		</Stack>
	);
};

export default Layout;

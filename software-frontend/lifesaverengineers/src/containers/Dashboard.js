import { Box, Stack, Grid, Skeleton } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import {
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Brush,
	AreaChart,
	Area,
} from "recharts";
import appColor from "../styles/colors";
import { doc, getDoc } from "firebase/firestore";
import { Context } from "../hooks/contexts/AuthContext";

const Graph = (props) => {
	const { sx, data, loading } = props;
	const width = 400;
	const height = 300;
	return loading ? (
		<Skeleton
			width={width}
			height={height}
			sx={{ ...sx, borderRadius: "20px" }}
			animation={"pulse"}
			variant="rectangular"
		/>
	) : (
		<Box
			width={width}
			height={height}
			sx={{ backgroundColor: appColor.gray, borderRadius: "20px", ...sx }}
		>
			<ResponsiveContainer width="100%" height="100%">
				<AreaChart width={width} height={height} data={data} >
					<Brush
						height={50}
						fill={appColor.ashGreen}
						startIndex={Math.max(0, data.length - 25)}
						endIndex={data.length - 1}
						dataKey="timeStamp"
					>
						<AreaChart width={width} height={height} data={data}>
							<YAxis hide domain={["auto", "auto"]} />
							<Area
								type="basis"
								dataKey="bodyTemp"
								stroke={appColor.flax}
								fill={appColor.flax}
								strokeWidth={2}
							/>
						</AreaChart>
					</Brush>
					<YAxis type="number" domain={["auto", "auto"]} />
					<XAxis dataKey="timeStamp" />
					<Tooltip />
					<Area
						type="basis"
						dataKey="bodyTemp"
						stroke={appColor.flax}
						fill={appColor.flax}
						strokeWidth={2}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</Box>
	);
};

const Dashboard = () => {
	const { db, user } = useContext(Context);
	const documentRef = doc(db, `userId/${user.uid}/vitals/20240408`);
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState();

	//get key value from data with time stamp and return new obj
	const handleObject = (object, type) => {
		const newObject = object.map((element) => {
			let time = element.timestamp.slice(11, 16);
			return {
				bodyTemp: element[type],
				timeStamp: time,
			};
		});
		return newObject;
	};

	//fetchdata async
	const fetchGraphData = async () => {
		const docSnap = await getDoc(documentRef);

		setLoading(true);
		let results = [];
		if (docSnap.exists()) {
			results = Object.values(docSnap.data())[0];
		}
		return results;
	};
	useEffect(() => {
		fetchGraphData().then((e) => {
			setData(e);
			setTimeout(() => {
				setLoading(false);
			}, 2000);
		});
	}, []);

	return (
		<Grid
			container
			justifyContent="space-around"
			flexGrow={1}
			flexDirection="row"
		>
			<Graph
				sx={{ margin: "20px" }}
				data={handleObject(data, "bodyTemp")}
				loading={loading}
			/>
			<Graph
				sx={{ margin: "20px" }}
				data={handleObject(data, "heartRate")}
				loading={loading}
			/>
			<Graph
				sx={{ margin: "20px" }}
				data={handleObject(data, "bodyTemp")}
				loading={loading}
			/>
		</Grid>
	);
};

export default Dashboard;

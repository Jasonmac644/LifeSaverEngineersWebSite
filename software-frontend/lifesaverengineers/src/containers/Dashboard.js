import { Box, Stack, Grid } from "@mui/material";
import { useState, useContext, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  AreaChart,
  Area,
} from "recharts";
import appColor from "../styles/colors";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { Context } from "../hooks/contexts/AuthContext";

const Graph = () => {
  const { db, user } = useContext(Context);
  const width = 400;
  const height = 300;
  const documentRef = doc(db, `userId/${user.uid}/vitals/20240408`);
  const [data, setData] = useState([]);
  const [heartBeat, setHeartBeat] = useState([]);
  const [bodyTemp, setBodyTemp] = useState([]);
  const fetchGraphData = async () => {
    const docSnap = await getDoc(documentRef);
    let results = [];
    if (docSnap.exists()) {
      results = Object.values(docSnap.data())[0];
    }
    return results;
  };
  const handleObject = (object) => {
    const transformObject = object.map((element) => {
      let time = element.timestamp.slice(11, 16);
      return {
        bodyTemp: element.bodyTemp,
        timeStamp: time,
      };
    });
    return transformObject;
  };
  useEffect(() => {
    fetchGraphData().then((e) => {
      setData(e);
    });
  }, []);
  return (
    <Box
      width={width}
      height={height}
      sx={{ backgroundColor: appColor.gray, borderRadius: "20px" }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart width={width} height={height} data={handleObject(data)}>
          <Brush
            height={50}
            fill={appColor.ashGreen}
            startIndex={Math.max(0, data.length - 25)}
            endIndex={data.length - 1}
            dataKey="timeStamp"
          >
            <AreaChart width={width} height={height} data={handleObject(data)}>
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
  return (
    <Grid>
      <Graph />
    </Grid>
  );
};

export default Dashboard;

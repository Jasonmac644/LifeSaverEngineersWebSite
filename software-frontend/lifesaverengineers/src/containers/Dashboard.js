import {
  Box,
  Stack,
  Grid,
  Skeleton,
  Badge,
  appBarClasses,
  useMediaQuery,
} from "@mui/material";
import GoogleMapReact from "google-map-react";
import { useState, useContext, useEffect } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Brush,
  AreaChart,
  Area,
  Label,
} from "recharts";
import appColor from "../styles/colors";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { Context } from "../hooks/contexts/AuthContext";
import { EText } from "../components/common";
import { DesktopDatePicker } from "@mui/x-date-pickers/";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";

import dayjs from "dayjs";
const Graph = (props) => {
  const { sx, data, loading, name } = props;
  const isDesktop = useMediaQuery("(min-width:500px)");
  const width = isDesktop ? 400 : 330;
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
      {data != 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart width={width} height={height} data={data}>
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
                  dataKey={name}
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
              dataKey={name}
              stroke={appColor.flax}
              fill={appColor.flax}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
          width={width}
          height={height}
        >
          <Box
            sx={{
              width: "fit-content",
              height: "fit-content",
              userSelect: "none",
            }}
          >
            <EText type="M20" color="black">
              No {name} data for this day
            </EText>
          </Box>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

const Dashboard = () => {
  const { db, user } = useContext(Context);
  const [data, setData] = useState([]);
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [date, setDate] = useState(dayjs());
  const [loading, setLoading] = useState();
  const isDesktop = useMediaQuery("(min-width:700px");
  const documentRef = doc(
    db,
    `userId/${user.uid}/vitals/${date.format("YYYYMMDD")}`
  );
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 2,
  };
  const AnyReactComponent = ({ text }) => <div>{text}</div>;
  //get key value from data with time stamp and return new obj
  const handleObject = (object, type) => {
    let name = type;
    const newObject = object.map((element) => {
      let time = element.timestamp.slice(11, 16);

      return {
        [name]: element[type],
        timeStamp: time,
      };
    });

    return newObject;
  };

  //fetchdata async
  const fetchGraphData = async () => {
    const docSnap = await getDoc(documentRef);
    //setLoading(true);
    let results = [];
    if (docSnap.exists()) {
      results = Object.values(docSnap.data())[0];
    }
    return results;
  };

  useEffect(() => {
    fetchGraphData().then((e) => {
      setData(e);
      if (data) {
        setLoading(false);
      }
    });
    fetchdata().then((e) => {
      setHighlightedDays(e);
    });
  }, [date]);

  function ServerDay(props) {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
    const isSelected =
      !outsideCurrentMonth &&
      highlightedDays.some((highlightedDay) =>
        dayjs(highlightedDay).isSame(dayjs(day), "day")
      );
    return (
      <Badge
        key={props.day.toString()}
        overlap="circular"
        badgeContent={isSelected ? "🔴" : undefined}
      >
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
          disabled={!isSelected ? true : false}
          sx={{
            "&.Mui-selected:hover, &.Mui-selected:inactive": {
              backgroundColor: appColor.flax,
            },
          }}
        />
      </Badge>
    );
  }

  const fetchdata = async () => {
    let results = [];
    try {
      const documentRef = collection(db, `userId/${user.uid}/vitals`);
      const docSnap = await getDocs(documentRef);
      docSnap.forEach((doc) => {
        results.push(dayjs(doc.id)); // Assuming doc.id is a date string
      });
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    }
    return results;
  };
  return (
    <Stack direction="column" alignItems="center">
      <Box
        height={"400px"}
        width={"90%"}
        borderRadius="20px"
        backgroundColor={appColor.kaki}
        mt="20px"
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <div style={{ height: "350px", width: "90%", borderRadius:"20px" }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
              language: "en",
              region: "en",
            }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
          >
            <AnyReactComponent
              lat={59.955413}
              lng={30.337844}
              text="My Marker"
            />
          </GoogleMapReact>
        </div>
      </Box>
      <Box
        height={"40%"}
        width={"90%"}
        borderRadius="20px"
        backgroundColor={appColor.kaki}
        mt="20px"
      >
        
        <Stack
          direction="row"
          sx={{
            justifyContent: "center",
            alignItems: "center",
            my: "20px",
            p: "10px",
            borderRadius: "20px",
          }}
        >
          <EText
            type={isDesktop ? "b30" : "b20"}
            style={{ paddingRight: "10px" }}
          >
            Select Date:
          </EText>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              value={date}
              defaultValue={date}
              onChange={(value) => setDate(value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                  color: "black",
                },
              }}
              slots={{
                day: ServerDay,
              }}
              slotProps={{
                day: {
                  highlightedDays,
                },
                desktopPaper: {
                  sx: {
                    backgroundColor: appColor.ashGreen,
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Stack>

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
            name="bodyTemp"
          />
          <Graph
            sx={{ margin: "20px" }}
            data={handleObject(data, "heartRate")}
            loading={loading}
            name="heartRate"
          />
          <Graph
            sx={{ margin: "20px" }}
            data={handleObject(data, "bodyTemp")}
            loading={loading}
            name="bodyTemp"
          />
        </Grid>
      </Box>
      
    </Stack>
  );
};

export default Dashboard;

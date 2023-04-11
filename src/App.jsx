import React, { useState, useEffect } from "react";
import axios from "axios";
import MyTooltip from "./components/MyTooltip";
import GetRouteNumberModal from "./components/GetRouteNumberModal"
import styled, { ThemeProvider } from "styled-components";
import "bootstrap/dist/css/bootstrap.css";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
} from "reactstrap";
import gloalStyles from "./global.css";
import mainlogo from "./assets/mainlogo.png";
import darklogo from "./assets/dark.png";
import lightlogo from "./assets/light.png";
import busnumlogo from "./assets/busnum.png";


// light theme1
const lightTheme = {
  backgroundColor: "white",
  color: "black",
};

// dark theme1
const darkTheme = {
  backgroundColor: "#333333",
  color: "white",
};

const DataWrapper = styled.section`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.color};
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  padding: 0;
  transition: all .3s ease;
`;

const DataUpperBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ToDarkbtn = styled.button`
  background-image: ${(props) => props.theme.backgroundImage};
  margin-left: ${(props) => props.theme.marginLeft};
  width: 42px;
  height: 42px;
  border-radius: 20rem;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  transition:all .6s ease;
`;

// light theme btn
const lightThemeBtn = {
  backgroundImage: `url(${darklogo})`,
  marginLeft:"3px"
};

// dark theme btn
const darkThemeBtn = {
  backgroundImage: `url(${lightlogo})`,
  marginLeft:`30px`
};

// clock

const ClockInfo = styled.div`
    position: absolute;
    height: 100%;
    bottom: 0;
    left: 0;
    writing-mode: tb;
    rotate: 180deg;
  `;

const AssistBtn = styled.button`
    border-radius: 0.5rem;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: help!important;
    top: 1rem;
    right: 1rem;
    position: fixed;
    background:#333333;
    color:white;
  `;


const MainInput = styled.input`
    border-radius: 20rem;
    border: none;
    width: 55%;
    height: 42px;
    text-align: center;
    font-size: 1.2rem;
    background: rgb(237 231 231);
    color: black;
`;

const DataUlWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
  width: 100%;
  height: 100%;
  font-size: 0px;
  line-height: 0;
  margin: 0px;
  padding: 0px;
  list-style: none;
  overflow: scroll;
  white-space: nowrap;
`;

const DataLiWrapper = styled.li`
  background-color: rgb(223, 218, 211);
  color: black;
  font-size: 0.9rem;
  line-height: 140%;
  display: inline-block;
  width: 85%;
  height: unset;
  z-index: 0;
  transition: all 0.6s ease;
  &:hover {
    background-color: blue;
    color: white;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    cursor: pointer;
  }
`;

// light theme2
const lightTheme2 = {
  filter: "hue-rotate(1288deg) saturate(1.2) contrast(1.1) brightness(0.95)",
};

// dark theme2
const darkTheme2 = {
  filter: "invert(1.0) hue-rotate(225deg) contrast(0.9)",
};

const MapWrapper = styled.section`
  filter: ${(props) => props.theme.filter};
  padding: 0;
`;

const App = () => {
  const [busStop, setBusStop] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [busSchedule, setBusSchedule] = useState([]);
  const [error, setError] = useState("");
  const [busStopName, setBusStopName] = useState("");
  const [suggestedStops, setSuggestedStops] = useState([]);
  const [latitude, setLatitude] = useState(49.2812); // Vancouver City Centre SkyTrain Stationの緯度
  const [longitude, setLongitude] = useState(-123.1188); // Vancouver City Centre SkyTrain Stationの経度

  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [time, setTime] = useState(new Date());


  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // const apiKey = "1HNL93HFg1afzV7c8J9v";
  const apiKey = import.meta.env.VITE_APP_API_TOKEN;
  // console.log(apiKey);


  const getSuggestedStops = async (searchText) => {
    try {
      const response = await axios.get(
        `https://api.translink.ca/rttiapi/v1/stops?apikey=${apiKey}&name=${searchText}`
      );
      setSuggestedStops(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getBusLocation = async (routeNo, vehicleNo) => {
    try {
      const response = await axios.get(
        `https://api.translink.ca/rttiapi/v1/buses?apikey=${apiKey}&routeNo=${routeNo}&vehicleNo=${vehicleNo}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
      setError("Failed to get location information");
      return null;
    }
  };

  const getBusSchedule = async () => {
    if (!busNumber) {
      toggleModal(); // Open Modal
      return;
    }
    try {
      const response = await axios.get(
        `https://api.translink.ca/rttiapi/v1/stops/${busStop}/estimates?apikey=${apiKey}&routeNo=${busNumber}`
      );
      setBusSchedule(response.data[0].Schedules);
      setBusStopName(response.data[0].StopName);
      setError("");

      const locationData = await getBusLocation(
        busNumber,
        response.data[0].Schedules[0].VehicleNo
      );
      console.log(locationData);
      if (locationData.length > 0) {
        // 位置情報をJSONフォーマットにする
        const locationJson = JSON.stringify(locationData, null, 2);
        console.log(locationJson);
        // 緯度経度を取得する
        const latitude = parseFloat(locationData[0].Latitude);
        const longitude = parseFloat(locationData[0].Longitude);
        setLatitude(latitude);
        setLongitude(longitude);

        const destination = locationData[0].Destination;
      } else {
        console.log("Location data not found.");
        setError("Failed to get location information");
      }
    } catch (error) {
      console.log(error);
      toggleModal(); // Open Modal
      // setError(
      //   ""
      // );
    }
  };

  useEffect(() => {
    if (busStop !== "" && busNumber !== "") {
      getBusSchedule();
    }
  }, [busStop]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  return (
    <>
      <div className="row">
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
          <DataWrapper className="col-md-4">
            <DataUpperBox className="m-3">
              <img
                style={{
                  width: "70px",
                  height: "70px",
                }}
                src={mainlogo}
                alt="mainlogo"
                className="mt-3 mb-2"
              />
              <h1 className="mt-2 mb-3">Next Bus QuickChecker</h1>
              <label className="mb-2">🚏 Bus Stop Number</label>
              <MainInput
                type="text"
                value={busStop}
                onChange={(e) => setBusStop(e.target.value)}
                className="mb-2"
              />
              <label className="mb-2">🚌 Bus Route Number</label>
              <MainInput
                type="text"
                value={busNumber}
                onChange={(e) => setBusNumber(e.target.value)}
                className="mb-3"
              />
              <button
                onClick={getBusSchedule}
                className="mb-2"
              >Get Result</button>
              {error && <p>{error}</p>}
              <ThemeProvider theme={isDarkMode ? darkThemeBtn : lightThemeBtn}>
                <div
                  style={{
                    width: "75px",
                    height: "45px",
                    borderRadius: "20rem",
                    background: "red",
                    position: "absolute",
                    top: "1rem",
                    left: "1rem",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    zIndex: "9999"
                  }}
                >
                <ToDarkbtn onClick={toggleDarkMode} />
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: "1rem",
                    left: "1rem",
                    fontSize: "0.8rem",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: "0.9",
                    zIndex:"1"
                  }}
                >
                  <MyTooltip className="me-2">
                  </MyTooltip>
                  <AssistBtn>
                  <img
                      style={{
                        width: "19px",
                        height: "19px",
                      }}
                      src={busnumlogo}
                      alt="busnumlogo"
                      className="m-2"
                  />
                  <p className="m-2">Get Route Number from Bus Stop 👉</p>
                  <GetRouteNumberModal />
                  </AssistBtn>
                </div>
              </ThemeProvider>
              <ClockInfo>
                <p>{time.toLocaleTimeString()}</p>
              </ClockInfo>
            </DataUpperBox>
            <DataUlWrapper className="pt-3 pb-3">
              {busSchedule.map((schedule) => (
                <DataLiWrapper
                  key={schedule.ExpectedLeaveTime}
                  className="p-2 mt-2"
                >
                  {schedule.ExpectedLeaveTime}
                  <p>Destination:{schedule.Destination}</p>
                </DataLiWrapper>
              ))}
            </DataUlWrapper>
            <Modal isOpen={modal} toggle={toggleModal}>
              <ModalHeader toggle={toggleModal}>Error</ModalHeader>
              <ModalBody>
                <p>
                  An error has occurred. You may have the following problems.
                </p>
                <ul>
                  <li>Input field may be blank.</li>
                  <li>The bus stop or route number may be incorrect.</li>
                  <li>
                    It may be a time when buses are not running in the immediate
                    future, such as late at night
                  </li>
                  <li>Temporary problems on company's service include API and websites</li>
                </ul>
                <p>
                  Please check the information you entered, or try again later.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={toggleModal}>
                  Dismiss
                </Button>
              </ModalFooter>
            </Modal>
          </DataWrapper>
        </ThemeProvider>

        <ThemeProvider theme={isDarkMode ? darkTheme2 : lightTheme2}>
          <MapWrapper className="col-md-8">
            {latitude && longitude && (
              <iframe
                src={`https://maps.google.com/maps?q=${latitude},${longitude}&output=embed`}
                // width="600"
                // height="450"
                style={{
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
              ></iframe>
            )}
          </MapWrapper>
        </ThemeProvider>
      </div>
    </>
  );
};
export default App;

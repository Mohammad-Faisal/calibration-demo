import React, { useState, useEffect } from "react";
import { CalibrationData, LaneData, SurveyCalibration } from "@amagroup.io/amag-corelib";
import { StaticMapProps, CalibrationComponent } from "./SurveyCalibration";
import { LaneDetectionComponent } from "./SurveyCalibration/LaneDetectionComponent";
const normalImageUrl =
  "https://media.istockphoto.com/photos/road-in-mountains-picture-id491712724?k=20&m=491712724&s=612x612&w=0&h=Jm11Gd2r3G__G1ob1n3fMkmkgalzaJw79mT4DQD2yRc=";

interface LaneDataMap {
  [key: string]: LaneData;
}

interface CalibrationDataMap {
  [key: string]: CalibrationData;
}

function App() {
  const mapProps: StaticMapProps = {
    lat: -27.470125,
    lng: 153.021072,
    scale: 2,
    width: 640,
    height: 640,
    mapType: "satellite",
    zoom: 20,
    hideLabels: false,
  };

  const [laneData, setLaneData] = useState<LaneDataMap>({});
  const [surveyCalibration, setSurveyCalibration] = useState<SurveyCalibration | undefined>();
  const [calibrationData, setCalibrationData] = useState<CalibrationDataMap>({});

  const showFinalData = () => {
    const surveyCalibration: SurveyCalibration = {
      Customer: "AMAG",
      SurveyId: "31",
      Id: "56~1637156676748",
      Name: "First calibration",
      Description: "This calibration is the default for this site",
      CalibrationData: Object.values(calibrationData),
      LaneData: Object.values(laneData),
    } as SurveyCalibration;
    setSurveyCalibration(surveyCalibration);
    localStorage.setItem("CALIBRATION", JSON.stringify(surveyCalibration));
  };

  const getCalibrationData = (data: CalibrationData) => {
    setCalibrationData((prev) => {
      prev[data.index] = data;
      return prev;
    });
  };

  const getLaneData = (receivedLaneData: LaneData) => {
    setLaneData((prev) => {
      prev[receivedLaneData.index] = receivedLaneData;
      return prev;
    });
  };

  const addNewLane = () => {
    setLaneData((prevLaneData) => {
      const currentLength = Object.keys(prevLaneData).length;
      const newLaneData: LaneData = {
        index: currentLength,
        ShapeType: "Polygon",
        Name: `Lane Number ${currentLength + 1}`,
        DirectionId: "21",
        Points: [],
      };
      prevLaneData[currentLength] = newLaneData;
      console.log(prevLaneData);
      return { ...prevLaneData };
    });
  };

  const editData = () => {
    const savedData = JSON.parse(localStorage.getItem("CALIBRATION") ?? "");
    const emptyObject: any = {};
    savedData.LaneData.forEach((laneData: any) => {
      emptyObject[laneData.index] = laneData;
    });
    setLaneData(emptyObject);
    setCalibrationData({ "0": savedData.CalibrationData[0] });
  };

  useEffect(() => {
    const calibrationData: CalibrationData = {
      index: 0,
      ShapeType: "Polygon",
      Description: "Calibration Data",
      Points: [],
    };
    setCalibrationData({ "0": calibrationData });
  }, []);

  return (
    <div className="App">
      <div>
        <div> {"Nothing"}</div>
        <button onClick={editData}> Edit This one</button>
      </div>

      <div style={{ margin: "20px" }}>
        Final Data: <pre style={{ height: "100%" }}>{JSON.stringify(surveyCalibration, null, 2)}</pre>
      </div>

      {Object.values(calibrationData).map((singleCalibrationData) => (
        <CalibrationComponent
          key={singleCalibrationData.index}
          isEditMode={true}
          calibrationData={singleCalibrationData}
          staticImageSrc={normalImageUrl}
          staticMapProps={mapProps}
          triggerCalibrationDataChange={getCalibrationData}
        />
      ))}

      {Object.values(laneData).map((singleLaneData) => (
        <LaneDetectionComponent
          key={singleLaneData.index}
          isEditMode={true}
          laneData={singleLaneData}
          staticImageSrc={normalImageUrl}
          triggerLaneDataChange={getLaneData}
        />
      ))}

      <button onClick={addNewLane}> Add new Lane</button>
      <button onClick={showFinalData}> Show the data </button>
    </div>
  );
}

export default App;

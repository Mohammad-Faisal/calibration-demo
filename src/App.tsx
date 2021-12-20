import React, { useState } from "react";
import { CalibrationData, SurveyCalibration } from "@amagroup.io/amag-corelib";
import { StaticMapProps, SimplifiedCalibrationComponent } from "./SimplifiedCalibration";
const normalImageUrl =
  "https://media.istockphoto.com/photos/road-in-mountains-picture-id491712724?k=20&m=491712724&s=612x612&w=0&h=Jm11Gd2r3G__G1ob1n3fMkmkgalzaJw79mT4DQD2yRc=";

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

  const [calibrationData, setCalibrationData] = useState<CalibrationData | undefined>();
  const [surveyCalibration, setSurveyCalibration] = useState<SurveyCalibration>();

  const getCalibrationData = (data: CalibrationData) => {
    const dataToSave = {
      Customer: "AMAG",
      Id: "56~1637156676748",
      Name: "First calibration",
      Description: "This calibration is the default for this site",
      CalibrationData: [data],
      LaneData: [],
    };
    setCalibrationData(data);
    // setSurveyCalibration(dataToSave);
    // console.log("saving ", data);
    localStorage.setItem("CAL_ITEMS", JSON.stringify(data));
  };

  return (
    <div className="App">
      <div>
        <div> {"Nothing"}</div>
        <button onClick={() => setCalibrationData(JSON.parse(localStorage.getItem("CAL_ITEMS") ?? ""))}>
          {" "}
          Edit This one
        </button>
      </div>
      <SimplifiedCalibrationComponent
        isEditMode={true}
        calibrationData={calibrationData}
        staticImageSrc={normalImageUrl}
        staticMapProps={mapProps}
        triggerCalibrationDataChange={getCalibrationData}
      />
    </div>
  );
}

export default App;

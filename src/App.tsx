import React, { useState } from "react";
import { SimplifiedCalibrationComponent } from "./calibration/SimplifiedCalibrationContainer";
import { CalibrationData, SurveyCalibration } from "@amagroup.io/amag-corelib";
import { StaticMapProps } from "./calibration/StaticMapImage";
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
    console.log("found ", data);

    const dataToSave: SurveyCalibration = {
      Customer: "AMAG",
      Id: "56~1637156676748",
      Name: "First calibration",
      Description: "This calibration is the default for this site",
      CalibrationData: data,
    };
    setCalibrationData(data);
    setSurveyCalibration(dataToSave);

    const currentItems = localStorage.getItem("CAL_ITEMS");
    const current = currentItems ? JSON.parse(currentItems) : [];
    current.push(dataToSave);
    // localStorage.setItem("CAL_ITEMS", JSON.stringify(current));
  };

  const getCurrentItems = () => {
    const currentItems = localStorage.getItem("CAL_ITEMS");
    return currentItems ? JSON.parse(currentItems) : [];
  };

  const currentItems = getCurrentItems();

  return (
    <div className="App">
      <div>
        {currentItems.map((item: any) => {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
                border: "1px solid",
                margin: "10px",
              }}
            >
              <div> {item.Name}</div>
              <button onClick={() => setCalibrationData(item.CalibrationData)}> Edit This one</button>
            </div>
          );
        })}
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

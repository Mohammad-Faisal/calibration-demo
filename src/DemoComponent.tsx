import React, { useState } from "react";
import { CalibrationData } from "@amagroup.io/amag-corelib";
import { StaticMapProps, SimplifiedCalibrationComponent } from "./SimplifiedCalibration";

const normalImageUrl =
  "https://media.istockphoto.com/photos/road-in-mountains-picture-id491712724?k=20&m=491712724&s=612x612&w=0&h=Jm11Gd2r3G__G1ob1n3fMkmkgalzaJw79mT4DQD2yRc=";

const mapSettings: StaticMapProps = {
  lat: -27.470125,
  lng: 153.021072,
  scale: 2,
  width: 640,
  height: 640,
  mapType: "satellite",
  zoom: 20,
  hideLabels: false,
};

function DemoComponent() {
  // to update an existing calibration model just set the calibration data here
  const [calibrationData, setCalibrationData] = useState<CalibrationData | undefined>();

  const getCalibrationData = (data: CalibrationData) => {
    // ge the calibration data here
    // then create the survey calibration model and send to API
    setCalibrationData(data);
  };

  return (
    <SimplifiedCalibrationComponent
      isEditMode={true}
      calibrationData={calibrationData}
      staticImageSrc={normalImageUrl}
      staticMapProps={mapSettings}
      triggerCalibrationDataChange={getCalibrationData}
    />
  );
}

export default DemoComponent;

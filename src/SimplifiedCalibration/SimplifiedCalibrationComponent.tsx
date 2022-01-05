import React from "react";
import { Button } from "@material-ui/core";
import { useState, useEffect } from "react";
import { CalibrationCanvas, ShapePoint } from "./SimplifiedCalibrationCanvas";
import { CalibrationStatus } from "../misc";
import { MapUtility } from "../utils";
import { StaticMapProps } from "../misc/StaticMapImage";
import { useCalibrationToShapePointConverter } from "../hooks";
import { CalibrationData, HomographyPoint } from "@amagroup.io/amag-corelib";

export enum ImageType {
  STATIC_IMAGE,
  STATIC_MAP,
}

interface SimplifiedCalibrationProps {
  isEditMode: boolean;
  staticImageSrc: string;
  staticMapProps: StaticMapProps;
  calibrationData: CalibrationData | undefined;
  triggerCalibrationDataChange: (data: CalibrationData) => void;
}

const emptyData = [
  { x: -1, y: -1, X: -1, Y: -1, lat: -1, lng: -1, index: 0 },
  { x: -1, y: -1, X: -1, Y: -1, lat: -1, lng: -1, index: 1 },
  { x: -1, y: -1, X: -1, Y: -1, lat: -1, lng: -1, index: 2 },
  { x: -1, y: -1, X: -1, Y: -1, lat: -1, lng: -1, index: 3 },
  { x: -1, y: -1, X: -1, Y: -1, lat: -1, lng: -1, index: 4 },
  { x: -1, y: -1, X: -1, Y: -1, lat: -1, lng: -1, index: 5 },
];

export const SimplifiedCalibrationComponent = ({
  isEditMode,
  staticImageSrc,
  staticMapProps,
  triggerCalibrationDataChange,
  calibrationData,
}: SimplifiedCalibrationProps) => {
  const [homographyPoints, setHomographyPoints] = useState<HomographyPoint[]>(emptyData);

  console.log("calibration data is ", calibrationData);
  // const { isImageLineValid: isFirstImageLineValid, isMapLineValid: isFirstMapLineValid } =
  //   useCalibrationLineValidityChecker(firstPoint, secondPoint);

  // const { isImageLineValid: isSecondImageLineValid, isMapLineValid: isSecondMapLineValid } =
  //   useCalibrationLineValidityChecker(thirdPoint, fourthPoint);

  const color = "#f51717";

  const { staticImagePoints, mapImagePoints } = useCalibrationToShapePointConverter(calibrationData);

  // convert the calibration data form the parent into the points data for this component

  const calculateHomographyPointFromShapePointData = (
    prev: HomographyPoint | undefined,
    newData: ShapePoint,
    imageType: ImageType,
    index: number
  ): HomographyPoint | undefined => {
    if (!newData) return;
    let newPoint: HomographyPoint;

    if (prev) newPoint = { ...prev };
    else newPoint = { x: -1, y: -1, X: -1, Y: -1, lat: -1, lng: -1, index };

    if (imageType === ImageType.STATIC_IMAGE) {
      newPoint.x = newData.x;
      newPoint.y = newData.y;
    } else {
      newPoint.X = newData.x;
      newPoint.Y = newData.y;
      const coOrdinates = MapUtility.getMapCoordinates(newData.x, newData.y, staticMapProps);
      newPoint.lat = coOrdinates.Lat;
      newPoint.lng = coOrdinates.Lng;
    }
    // console.log("new points is ", newPoint);

    return newPoint;
  };

  const receiveData = (data: ShapePoint[], imageType: ImageType) => {
    // const currentLength = data.length;
    const currentLength = homographyPoints.length;
    const newHomographyPoints: HomographyPoint[] = [];
    for (let i = 0; i < currentLength; i++) {
      const oldPoint = homographyPoints[i];
      if (data[i]) {
        const homographyPoint = calculateHomographyPointFromShapePointData(oldPoint, data[i], imageType, i);
        if (homographyPoint) newHomographyPoints.push(homographyPoint);
      } else {
        newHomographyPoints.push(oldPoint);
      }
    }
    setHomographyPoints(newHomographyPoints);
  };

  const isComplete = () => {
    return true;
    // if (isFirstImageLineValid && isSecondImageLineValid && isFirstMapLineValid && isSecondMapLineValid) return true;
    // return false;
  };

  useEffect(() => {
    console.log("current ", homographyPoints);
  }, [homographyPoints]);

  const saveData = () => {
    const calibrationData: CalibrationData = {
      index: 0,
      ShapeType: "Polygon",
      Description: "This is a dummy data",
      Points: homographyPoints ?? [],
    };
    console.log("saving ", calibrationData);
    triggerCalibrationDataChange(calibrationData);
  };

  return (
    <div style={{ display: "grid", justifyItems: "center", gridGap: "10px", width: "100vw" }}>
      <div style={{ display: "flex", gap: "20px", flexGrow: "1" }}>
        <CalibrationCanvas
          isEditMode={isEditMode}
          imagePath={staticImageSrc}
          imageType={ImageType.STATIC_IMAGE}
          fillColor={color}
          onDataChangeTrigger={receiveData}
          points={staticImagePoints}
        />
        <CalibrationCanvas
          isEditMode={isEditMode}
          imageType={ImageType.STATIC_MAP}
          fillColor={color}
          staticMapProps={staticMapProps}
          onDataChangeTrigger={receiveData}
          points={mapImagePoints}
        />
      </div>

      {/* <div style={{ display: "flex", padding: "20px 0px", justifyContent: "space-between" }}>
        <CalibrationStatus status={isFirstImageLineValid} message={"First line on the image"} />
        <CalibrationStatus status={isSecondImageLineValid} message={"Second parallel line on the image"} />
        <CalibrationStatus status={isFirstMapLineValid} message={"First line on the map"} />
        <CalibrationStatus status={isSecondMapLineValid} message={"Second parallel line on the map"} />
      </div> */}

      <Button variant={"contained"} color="primary" onClick={saveData} disabled={!isComplete()}>
        Save
      </Button>

      <div style={{ margin: "20px" }}>
        Calibration Result: <pre style={{ height: "100%" }}>{JSON.stringify(calibrationData, null, 2)}</pre>
      </div>
    </div>
  );
};

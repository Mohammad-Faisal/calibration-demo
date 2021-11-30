import { Button } from "@material-ui/core";
import { useState, useEffect } from "react";
import { CalibrationCanvas, ShapePoint } from "./SimplifiedCalibrationCanvas";
import { CalibrationStatus } from "./misc";
import { MapUtility } from "./utils";
import { StaticMapProps } from "./misc/StaticMapImage";
import { CalibrationData, HomographyPoint } from "@amagroup.io/amag-corelib";
import { useCalibrationToShapePointConverter, useCalibrationLineValidityChecker } from "./hooks";

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

export const SimplifiedCalibrationComponent = ({
  isEditMode,
  staticImageSrc,
  staticMapProps,
  triggerCalibrationDataChange,
  calibrationData,
}: SimplifiedCalibrationProps) => {
  const [firstPoint, setFirstPoint] = useState<HomographyPoint | undefined>();
  const [secondPoint, setSecondPoint] = useState<HomographyPoint | undefined>();
  const [thirdPoint, setThirdPoint] = useState<HomographyPoint | undefined>();
  const [fourthPoint, setFourthPoint] = useState<HomographyPoint | undefined>();

  const { isImageLineValid: isFirstImageLineValid, isMapLineValid: isFirstMapLineValid } =
    useCalibrationLineValidityChecker(firstPoint, secondPoint);

  const { isImageLineValid: isSecondImageLineValid, isMapLineValid: isSecondMapLineValid } =
    useCalibrationLineValidityChecker(thirdPoint, fourthPoint);

  const color = "#f51717";

  const { staticImagePoints, mapImagePoints } = useCalibrationToShapePointConverter(calibrationData);

  // convert the calibration data form the parent into the points data for this component
  useEffect(() => {
    if (!calibrationData) return;
    console.log("need to process", calibrationData);
    setFirstPoint(calibrationData?.Lines[0].points[0]);
    setSecondPoint(calibrationData?.Lines[0].points[1]);
    setThirdPoint(calibrationData?.Lines[1].points[0]);
    setFourthPoint(calibrationData?.Lines[1].points[1]);
  }, [calibrationData]);

  const calculateHomographyPointFromShapePointData = (
    prev: HomographyPoint | undefined,
    newData: ShapePoint,
    imageType: ImageType,
    index: number
  ) => {
    if (!newData) return;
    let newPoint;
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
    return newPoint;
  };

  const receiveData = (data: ShapePoint[], imageType: ImageType) => {
    if (data.length === 0) return;
    if (data.length > 0)
      setFirstPoint((prev) => calculateHomographyPointFromShapePointData(prev, data[0], imageType, 0));
    if (data.length > 1)
      setSecondPoint((prev) => calculateHomographyPointFromShapePointData(prev, data[1], imageType, 1));
    if (data.length > 2)
      setThirdPoint((prev) => calculateHomographyPointFromShapePointData(prev, data[2], imageType, 0));
    if (data.length > 3)
      setFourthPoint((prev) => calculateHomographyPointFromShapePointData(prev, data[3], imageType, 1));
  };

  const isComplete = () => {
    if (isFirstImageLineValid && isSecondImageLineValid && isFirstMapLineValid && isSecondMapLineValid) return true;
    return false;
  };

  const saveData = () => {
    if (firstPoint && secondPoint && thirdPoint && fourthPoint) {
      const calibrationData: CalibrationData = {
        Lines: [
          {
            index: 0,
            shapeType: "Lines",
            points: [firstPoint, secondPoint],
          },
          {
            index: 1,
            shapeType: "Lines",
            points: [thirdPoint, fourthPoint],
          },
        ],
      };
      triggerCalibrationDataChange(calibrationData);
    } else {
      console.log("something went wrong");
    }
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

      <div style={{ display: "flex", padding: "20px 0px", justifyContent: "space-between" }}>
        <CalibrationStatus status={isFirstImageLineValid} message={"First line on the image"} />
        <CalibrationStatus status={isSecondImageLineValid} message={"Second parallel line on the image"} />
        <CalibrationStatus status={isFirstMapLineValid} message={"First line on the map"} />
        <CalibrationStatus status={isSecondMapLineValid} message={"Second parallel line on the map"} />
      </div>

      <Button variant={"contained"} color="primary" onClick={saveData} disabled={!isComplete()}>
        Save
      </Button>

      <div style={{ margin: "20px" }}>
        Calibration Result: <pre style={{ height: "100%" }}>{JSON.stringify(calibrationData, null, 2)}</pre>
      </div>
    </div>
  );
};

import React from "react";
import { useState, useEffect } from "react";
import { CalibrationCanvas, CalibrationSurfaceType } from "./misc";
import { MapUtility } from "./utils";
import { StaticMapProps } from "./misc/StaticMapImage";
import { useCalibrationToShapePointConverter } from "./hooks";
import { CalibrationData, HomographyPoint, ImageCoordinates } from "@amagroup.io/amag-corelib";

interface CalibrationProps {
  isEditMode: boolean;
  staticImageSrc: string;
  staticMapProps: StaticMapProps;
  calibrationData: CalibrationData;
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

export const CalibrationComponent = (props: CalibrationProps) => {
  const { isEditMode, staticImageSrc, staticMapProps, triggerCalibrationDataChange, calibrationData } = props;

  const [homographyPoints, setHomographyPoints] = useState<HomographyPoint[]>(emptyData);
  const { staticImagePoints, mapImagePoints } = useCalibrationToShapePointConverter(calibrationData);

  const calculateHomographyPointFromImageCoordinates = (
    prev: HomographyPoint | undefined,
    newData: ImageCoordinates,
    imageType: CalibrationSurfaceType,
    index: number
  ): HomographyPoint | undefined => {
    if (!newData) return;
    let newPoint: HomographyPoint;

    if (prev) newPoint = { ...prev };
    else newPoint = { x: -1, y: -1, X: -1, Y: -1, lat: -1, lng: -1, index };

    if (imageType === CalibrationSurfaceType.STATIC_IMAGE) {
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

  const receiveData = (data: ImageCoordinates[], imageType: CalibrationSurfaceType) => {
    const currentLength = homographyPoints.length;
    const newHomographyPoints: HomographyPoint[] = [];
    for (let i = 0; i < currentLength; i++) {
      const oldPoint = homographyPoints[i];
      if (data[i]) {
        const homographyPoint = calculateHomographyPointFromImageCoordinates(oldPoint, data[i], imageType, i);
        if (homographyPoint) newHomographyPoints.push(homographyPoint);
      } else {
        newHomographyPoints.push(oldPoint);
      }
    }
    setHomographyPoints(newHomographyPoints);
  };

  useEffect(() => {
    const updated: CalibrationData = {
      ...calibrationData,
      Points: homographyPoints ?? [],
    };
    triggerCalibrationDataChange(updated);
  }, [homographyPoints]);

  return (
    <div style={{ display: "grid", justifyItems: "center", gridGap: "10px", width: "100vw" }}>
      <div style={{ display: "flex", gap: "20px", flexGrow: "1" }}>
        <CalibrationCanvas
          isEditMode={isEditMode}
          imagePath={staticImageSrc}
          imageType={CalibrationSurfaceType.STATIC_IMAGE}
          onDataChangeTrigger={receiveData}
          points={staticImagePoints}
        />

        <CalibrationCanvas
          isEditMode={isEditMode}
          imageType={CalibrationSurfaceType.STATIC_MAP}
          staticMapProps={staticMapProps}
          onDataChangeTrigger={receiveData}
          points={mapImagePoints}
        />
      </div>
    </div>
  );
};

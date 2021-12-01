import { useEffect, useState } from "react";
import { ShapePoint } from "../SimplifiedCalibrationCanvas";
import { CalibrationData } from "@amagroup.io/amag-corelib";

export const useCalibrationToShapePointConverter = (calibrationData: CalibrationData | undefined) => {
  const [staticImagePoints, setStaticImagePoints] = useState<ShapePoint[]>([]);
  const [mapImagePoints, setMapImagePoints] = useState<ShapePoint[]>([]);

  useEffect(() => {
    if (!calibrationData) return;
    const staticImagePoints = [
      {
        x: calibrationData?.Lines[0].points[0].x,
        y: calibrationData?.Lines[0].points[0].y,
        index: 0,
      },
      {
        x: calibrationData?.Lines[0].points[1].x,
        y: calibrationData?.Lines[0].points[1].y,
        index: 1,
      },
      {
        x: calibrationData?.Lines[1].points[0].x,
        y: calibrationData?.Lines[1].points[0].y,
        index: 2,
      },
      {
        x: calibrationData?.Lines[1].points[1].x,
        y: calibrationData?.Lines[1].points[1].y,
        index: 3,
      },
    ];
    setStaticImagePoints(staticImagePoints);

    const mapImagePoints = [
      {
        x: calibrationData?.Lines[0].points[0].X,
        y: calibrationData?.Lines[0].points[0].Y,
        index: 0,
      },
      {
        x: calibrationData?.Lines[0].points[1].X,
        y: calibrationData?.Lines[0].points[1].Y,
        index: 1,
      },
      {
        x: calibrationData?.Lines[1].points[0].X,
        y: calibrationData?.Lines[1].points[0].Y,
        index: 2,
      },
      {
        x: calibrationData?.Lines[1].points[1].X,
        y: calibrationData?.Lines[1].points[1].Y,
        index: 3,
      },
    ];
    setMapImagePoints(mapImagePoints);
  }, [calibrationData]);
  return { staticImagePoints, mapImagePoints };
};

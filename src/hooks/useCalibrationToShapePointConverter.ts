import { useEffect, useState } from "react";
import { ShapePoint } from "../SimplifiedCalibration/SimplifiedCalibrationCanvas";
import { CalibrationData } from "@amagroup.io/amag-corelib";

export const useCalibrationToShapePointConverter = (calibrationData: CalibrationData | undefined) => {
  const [staticImagePoints, setStaticImagePoints] = useState<ShapePoint[]>([]);
  const [mapImagePoints, setMapImagePoints] = useState<ShapePoint[]>([]);

  useEffect(() => {
    if (!calibrationData) return;
    if (calibrationData.Points.length === 0) return;

    const staticImagePoints = [];
    for (let i = 0; i < calibrationData.Points.length; i++) {
      staticImagePoints.push({
        x: calibrationData?.Points[i].x,
        y: calibrationData?.Points[i].y,
        index: i,
      });
    }
    setStaticImagePoints(staticImagePoints);

    const mapImagePoints = [];
    for (let i = 0; i < calibrationData.Points.length; i++) {
      mapImagePoints.push({
        x: calibrationData?.Points[i].X,
        y: calibrationData?.Points[i].Y,
        index: i,
      });
    }
    setMapImagePoints(mapImagePoints);
  }, [calibrationData]);
  return { staticImagePoints, mapImagePoints };
};

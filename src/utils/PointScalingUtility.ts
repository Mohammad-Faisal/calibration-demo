import { ImageCoordinates } from "@amagroup.io/amag-corelib";

export class PointScalingUtility {
  static getScaledPoint = (point: number, scale: number) => {
    point = point || 0;
    return point * scale;
  };

  static getScaledPoints = (points: ImageCoordinates[], scale: number) => {
    return points.map((p) => {
      return {
        ...p,
        x: Math.round(PointScalingUtility.getScaledPoint(p.x, scale)),
        y: Math.round(PointScalingUtility.getScaledPoint(p.y, scale)),
      };
    });
  };

  static getUnScaledPoint = (p: number, scale: number) => {
    return Math.round((p || 0) / scale);
  };
}

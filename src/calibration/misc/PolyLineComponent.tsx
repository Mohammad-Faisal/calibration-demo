import { ShapePoint } from "../SimplifiedCalibrationCanvas";

interface PolyLineProps {
  points: ShapePoint[];
  fillColor: string;
}
export const PolyLineComponent = ({ points, fillColor }: PolyLineProps) => {
  const pathPoints = points.map((d) => {
    return `${d.x},${d.y} `;
  });

  return (
    <polyline
      points={pathPoints.join("")}
      style={{
        stroke: fillColor,
        strokeWidth: 5,
        fill: fillColor,
      }}
    />
  );
};

import React from "react";
import { ImageCoordinates } from "@amagroup.io/amag-corelib";

interface PolyLineProps {
  points: ImageCoordinates[];
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

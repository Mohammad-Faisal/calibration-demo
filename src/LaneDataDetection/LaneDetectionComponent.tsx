import React from "react";
import { useState, useEffect } from "react";
import { LaneDetectionCanvas } from "./LaneDetectionCanvas";
import { LaneData, ImageCoordinates } from "@amagroup.io/amag-corelib";

interface LaneDetectionComponentProps {
  isEditMode: boolean;
  staticImageSrc: string;
  laneData: LaneData;
  triggerLaneDataChange: (data: LaneData) => void;
}

export const LaneDetectionComponent = (props: LaneDetectionComponentProps) => {
  const { isEditMode, staticImageSrc, triggerLaneDataChange, laneData } = props;
  const [imagePoints, setImagePoints] = useState<ImageCoordinates[]>([]);

  const color = "#f51717";

  useEffect(() => {
    setImagePoints(laneData.Points);
  }, [laneData]);

  const receiveData = (data: ImageCoordinates[]) => {
    const newLaneData = {
      ...laneData,
      Points: data,
    };
    triggerLaneDataChange(newLaneData);
  };

  return (
    <div style={{ display: "grid", justifyItems: "center", gridGap: "10px", width: "100vw" }}>
      <div style={{ display: "flex", gap: "20px", flexGrow: "1" }}>
        <LaneDetectionCanvas
          isEditMode={isEditMode}
          imagePath={staticImageSrc}
          fillColor={color}
          onDataChangeTrigger={receiveData}
          points={imagePoints}
        />
      </div>
    </div>
  );
};

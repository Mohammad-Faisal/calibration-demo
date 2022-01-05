import React from "react";
import { useState, useEffect } from "react";
import { LaneData, ImageCoordinates } from "@amagroup.io/amag-corelib";
import { CalibrationCanvas, CalibrationSurfaceType } from "../misc";

interface LaneDetectionComponentProps {
  isEditMode: boolean;
  staticImageSrc: string;
  laneData: LaneData;
  triggerLaneDataChange: (data: LaneData) => void;
}

export const LaneDetectionComponent = (props: LaneDetectionComponentProps) => {
  const { isEditMode, staticImageSrc, triggerLaneDataChange, laneData } = props;
  const [imagePoints, setImagePoints] = useState<ImageCoordinates[]>([]);

  useEffect(() => {
    setImagePoints(laneData.Points);
  }, [laneData]);

  const receiveData = (data: ImageCoordinates[], imageType: CalibrationSurfaceType) => {
    const newLaneData = {
      ...laneData,
      Points: data,
    };
    triggerLaneDataChange(newLaneData);
  };

  return (
    <div style={{ display: "grid", justifyItems: "center", gridGap: "10px", width: "100vw" }}>
      <div style={{ display: "flex", gap: "20px", flexGrow: "1" }}>
        <CalibrationCanvas
          isEditMode={isEditMode}
          imagePath={staticImageSrc}
          imageType={CalibrationSurfaceType.STATIC_IMAGE}
          onDataChangeTrigger={receiveData}
          points={imagePoints}
        />
      </div>
    </div>
  );
};

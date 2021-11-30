import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { ZoomController } from "./ZoomController";
import { DraggableShape } from "./DraggableShape";
import { PointScalingUtility } from "./utils/PointScalingUtility";
import { StaticMapProps, StaticMapSrc } from "./StaticMapImage";
import { ImageType } from "./SimplifiedCalibrationContainer";
import { PolyLineComponent } from "./PolyLineComponent";
import { CanvasUtility } from "./utils/CanvasUtility";

export interface ShapePoint {
  index: number;
  x: number;
  y: number;
}

interface CalibrationCanvasProps {
  fillColor: string;
  imageType: ImageType;
  points: ShapePoint[];
  onDataChangeTrigger: (data: ShapePoint[], imageType: ImageType) => void;
  isEditMode: boolean;
  imagePath?: string;
  staticMapProps?: StaticMapProps;
}

export const CalibrationCanvas: React.FC<CalibrationCanvasProps> = ({
  imageType,
  points,
  staticMapProps,
  isEditMode,
  onDataChangeTrigger,
  imagePath,
  fillColor,
}) => {
  const classes = useStyles();

  points = points || ([] as ShapePoint[]);

  const maxAllowedPoints = 4;

  const [storedPoints, setStoredPoints] = useState<ShapePoint[]>([]);
  const [scaledPoints, setScaledPoints] = useState<ShapePoint[]>([]);
  const [imageScale, setImageScale] = React.useState(1);

  // if the points array comes from the parent (while editing) change the stored components here
  useEffect(() => {
    setStoredPoints(points);
  }, [points]);

  // if the stored point changes inside this component pass them back to parent
  useEffect(() => {
    onDataChangeTrigger(storedPoints, imageType);
  }, [storedPoints]);

  // the stored points are not the same as the scaled points so update accordingly
  useEffect(() => {
    setScaledPoints(PointScalingUtility.getScaledPoints(storedPoints, imageScale));
  }, [storedPoints, imageScale]);

  const [imageSize, setImageSize] = React.useState({
    width: 600,
    height: 300,
  });

  const backgroundImageUrl = () => {
    if (imageType === ImageType.STATIC_IMAGE) return imagePath;
    else if (staticMapProps) return StaticMapSrc(staticMapProps);
  };

  const addNewPoint = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    if (storedPoints.length >= maxAllowedPoints) return;
    const { px, py } = CanvasUtility.getCoordinatesOfClickedPoint(e, imageScale);

    setStoredPoints((prevStatePoints) => {
      const points = [...prevStatePoints];
      const newPoint = { x: px, y: py } as ShapePoint;
      newPoint.index = points.length;
      points.push(newPoint);
      return points;
    });
  };

  // here we set the initial scale and size of the image
  const setInitialImageDimensions = (e: any) => {
    const imgElement = e.target as HTMLImageElement;
    const parentElement = imgElement.offsetParent as HTMLDivElement;
    const scaleHeight = parentElement.offsetHeight / imgElement.offsetHeight;
    const scaleWidth = parentElement.offsetWidth / imgElement.offsetWidth;
    const scale = Math.min(scaleHeight, scaleWidth);

    setImageScale(scale);
    setImageSize({
      height: imgElement.offsetHeight,
      width: imgElement.offsetWidth,
    });
  };

  const updatePointsBasedOnChangeOfShape = (newX: any, newY: any, index: any) => {
    if (!isEditMode) return;
    const updatedPoints = [...storedPoints];
    const updatedPoint = updatedPoints.find((x) => x.index === index) as ShapePoint;
    if (!updatedPoint) return;
    updatedPoint.x = PointScalingUtility.getUnScaledPoint(newX, imageScale);
    updatedPoint.y = PointScalingUtility.getUnScaledPoint(newY, imageScale);
    setStoredPoints(updatedPoints);
  };

  const updatePointsBasedOnShapeRemoval = (index: any) => {
    // do nothing because we don't want to remove any point otherwise we would remove it from the stored points
  };

  const updatePointsWhenShapeClicked = (id: any) => {
    // do nothing for now because we are dealing with 2 separate lines here
  };

  return (
    <>
      <div className={classes.drawShapeWrapper}>
        <ZoomController currentScale={imageScale} onChangeTrigger={setImageScale} />

        <div className={classes.drawShapeContainer}>
          {scaledPoints.map((singlePoint) => (
            <DraggableShape
              key={singlePoint.index?.toString() + imageScale.toString()}
              shapePoint={singlePoint}
              editMode={true}
              onChange={updatePointsBasedOnChangeOfShape}
              onRemove={updatePointsBasedOnShapeRemoval}
              onClick={updatePointsWhenShapeClicked}
            />
          ))}
          <svg
            viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
            width={imageScale * imageSize.width}
            height={imageScale * imageSize.height}
            onClick={addNewPoint}
            style={{
              backgroundImage: `url(${backgroundImageUrl()})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          >
            <PolyLineComponent fillColor={fillColor} points={storedPoints.slice(0, 2)} />
            <PolyLineComponent fillColor={fillColor} points={storedPoints.slice(2, 4)} />
          </svg>
        </div>

        <div className={classes.inVisibleImage}>
          <img alt={"mapShapeBgImg"} src={backgroundImageUrl()} onLoad={setInitialImageDimensions} />
        </div>
      </div>
    </>
  );
};

const useStyles = makeStyles({
  drawShapeWrapper: {
    position: "relative",
    border: "solid 1px rgba(0,0,0,0.5)",
    width: "100%",
    height: "100%",
  },
  drawShapeContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "auto",
    background: "rgba(0,0,0,0.05)",
  },
  inVisibleImage: {
    visibility: "hidden",
    width: 0,
    height: 0,
    overflow: "hidden",
  },
});

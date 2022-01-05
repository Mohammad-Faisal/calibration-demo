import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { ZoomController, DraggableShape, PolyLineComponent, StaticMapProps, StaticMapSrc } from ".";
import { CanvasUtility, PointScalingUtility } from "../utils";
import { ImageCoordinates } from "@amagroup.io/amag-corelib";

interface CalibrationCanvasProps {
  imageType: CalibrationSurfaceType;
  points: ImageCoordinates[];
  onDataChangeTrigger: (data: ImageCoordinates[], imageType: CalibrationSurfaceType) => void;
  isEditMode: boolean;
  imagePath?: string;
  staticMapProps?: StaticMapProps;
}

export enum CalibrationSurfaceType {
  STATIC_IMAGE,
  STATIC_MAP,
}

const FILL_COLOR = "#f51717";
const MAX_ALLOWED_POINTS = 10;

export const CalibrationCanvas: React.FC<CalibrationCanvasProps> = (props) => {
  const classes = useStyles();
  const { imageType, points, staticMapProps, isEditMode, onDataChangeTrigger, imagePath } = props;

  const [storedPoints, setStoredPoints] = useState<ImageCoordinates[]>([]);
  const [scaledPoints, setScaledPoints] = useState<ImageCoordinates[]>([]);
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
    if (imageType === CalibrationSurfaceType.STATIC_IMAGE) return imagePath;
    else if (staticMapProps) return StaticMapSrc(staticMapProps);
  };

  const addNewPoint = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    if (storedPoints.length >= MAX_ALLOWED_POINTS) return;
    const { px, py } = CanvasUtility.getCoordinatesOfClickedPoint(e, imageScale);

    setStoredPoints((prevStatePoints) => {
      const points = [...prevStatePoints];
      const newPoint = { x: px, y: py } as ImageCoordinates;
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
    const updatedPoint = updatedPoints.find((x) => x.index === index) as ImageCoordinates;
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
  const storedPointsForArea = [
    storedPoints[0],
    storedPoints[2],
    storedPoints[4],
    storedPoints[5],
    storedPoints[3],
    storedPoints[1],
  ];

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
            <PolyLineComponent fillColor={FILL_COLOR} points={storedPoints} />
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

import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Draggable from "react-draggable";
import { ShapePoint } from "../SimplifiedCalibrationCanvas";

interface DraggableShapeProps {
  shapePoint: ShapePoint;
  editMode: boolean;
  onChange?: any;
  onRemove?: any;
  onClick?: any;
}

export const DraggableShape: React.FC<DraggableShapeProps> = ({
  shapePoint,
  onChange,
  editMode,
  onRemove,
  onClick,
}: DraggableShapeProps) => {
  const classes = useStyles();

  const [state, setState] = useState({
    activeDrags: 0,
    deltaPosition: {
      x: shapePoint.x,
      y: shapePoint.y,
    },
    controlledPosition: {
      x: shapePoint.x,
      y: shapePoint.y,
    },
  });

  useEffect(() => {
    setState({
      activeDrags: 0,
      deltaPosition: {
        x: shapePoint.x,
        y: shapePoint.y,
      },
      controlledPosition: {
        x: shapePoint.x,
        y: shapePoint.y,
      },
    });
  }, [shapePoint]);

  const handleStart = () => {
    setState({ ...state, activeDrags: ++state.activeDrags });
  };

  const handleDrag = (e: any, ui: any) => {
    const { x, y } = state.deltaPosition;
    setState({
      ...state,
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      },
    });
    console.log(`${x + ui.deltaX}, ${y + ui.deltaY}`);
  };

  const handleStop = () => {
    if (state.controlledPosition.x === state.deltaPosition.x && state.controlledPosition.y === state.deltaPosition.y) {
      if (onClick) {
        onClick(shapePoint.index);
      }
      return;
    }
    setState({
      ...state,
      activeDrags: --state.activeDrags,
      controlledPosition: { ...state.deltaPosition },
    });
    console.log(`${state.deltaPosition.x}, ${state.deltaPosition.y}`);
    if (onChange) {
      onChange(state.deltaPosition.x, state.deltaPosition.y, shapePoint.index);
    }
  };

  const handleDblClick = () => {
    if (onRemove) {
      onRemove(shapePoint.index);
    }
  };

  const renderCircle = () => {
    return (
      <div className={`nodeCircle ${classes.nodeCircle}`} onDoubleClick={handleDblClick}>
        <span className={classes.nodeLabel}>{shapePoint.index + 1}</span>
      </div>
    );
  };

  return !editMode ? (
    <></>
  ) : (
    <Draggable position={state.deltaPosition} onStart={handleStart} onDrag={handleDrag} onStop={handleStop}>
      {renderCircle()}
    </Draggable>
  );
};

const useStyles = makeStyles({
  nodeCircle: {
    display: "block",
    width: 10,
    height: 10,
    marginLeft: -5,
    marginTop: -5,
    borderRadius: "50%",
    position: "absolute",
    background: "red",
  },
  nodeLabel: {
    position: "absolute",
    color: "white",
    fontSize: "1em",
    left: 9,
    top: -20,
    background: "rgb(0 0 0 / 60%)",
    padding: "0 4px",
    borderRadius: 4,
  },
});

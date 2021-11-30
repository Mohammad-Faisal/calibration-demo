import { IconButton, makeStyles, Slider } from "@material-ui/core";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";

interface ZoomControllerProps {
  currentScale: number;
  onChangeTrigger: (newValue: number) => void;
}

export const ZoomController = ({ currentScale, onChangeTrigger }: ZoomControllerProps) => {
  const classes = useStyles();

  const handleZoomButtonClick = (isZoomIn: boolean) => {
    onChangeTrigger(isZoomIn ? currentScale + 0.1 : currentScale - 0.1);
  };

  const handleZoomSliderChange = (event: any, newValue: any) => {
    onChangeTrigger(newValue);
  };

  return (
    <div className={classes.zoomPanel}>
      <IconButton aria-label="Zoom out" onClick={() => handleZoomButtonClick(false)}>
        <ZoomOutIcon />
      </IconButton>
      <Slider min={0} max={5} step={0.1} value={currentScale} onChange={handleZoomSliderChange} />
      <IconButton aria-label="Zoom in" onClick={() => handleZoomButtonClick(true)}>
        <ZoomInIcon />
      </IconButton>
    </div>
  );
};

const useStyles = makeStyles({
  zoomPanel: {
    position: "absolute",
    background: "rgba(255,255,255,0.8)",
    right: 20,
    top: 10,
    width: 200,
    zIndex: 1,
    padding: 10,
    display: "flex",
    border: "solid 1px rgba(0,0,0,0.5)",
    "& button": { color: "black", padding: 4, flex: 1 },
  },
});

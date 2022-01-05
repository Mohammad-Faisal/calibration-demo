import React from 'react'
import { IconButton, makeStyles } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import BlockOutlined from "@material-ui/icons/BlockOutlined";
interface CalibrationStatusProps {
  message: string;
  status: boolean;
}
export const CalibrationStatus = ({ message, status }: CalibrationStatusProps) => {
  const classes = useStyles({ status });

  return (
    <div className={`${classes.container} ${status ? classes.active : classes.disabled}`}>
      <IconButton aria-label="Zoom out">{status ? <CheckIcon /> : <BlockOutlined />}</IconButton>
      <div>{message}</div>
    </div>
  );
};

const useStyles = makeStyles({
  container: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    padding: "5px 10px",
    border: "1px solid",
    borderRadius: "4px",
    margin: "5px",
    textAlign: "center",
    alignItems: "center",
    color: "green",
  },
  disabled: {
    background: "#fafafa",
    color: "black",
  },
  active: {
    background: "#e2f5e6",
    color: "#0d5920",
  },
});

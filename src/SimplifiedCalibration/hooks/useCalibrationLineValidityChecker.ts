import { HomographyPoint } from "@amagroup.io/amag-corelib";
import { useEffect, useState } from "react";
export const useCalibrationLineValidityChecker = (
  firstPoint: HomographyPoint | undefined,
  secondPoint: HomographyPoint | undefined
) => {
  const [isImageLineValid, setIsImageLineValid] = useState<boolean>(false);
  const [isMapLineValid, setIsMapLineValid] = useState<boolean>(false);

  useEffect(() => {
    if (!firstPoint) setIsImageLineValid(false);
    else if (!secondPoint) setIsImageLineValid(false);
    else {
      const isValid = firstPoint.x !== -1 && secondPoint.x !== -1;
      setIsImageLineValid(isValid);
    }
  }, [firstPoint, secondPoint]);

  useEffect(() => {
    if (!firstPoint) setIsImageLineValid(false);
    else if (!secondPoint) setIsImageLineValid(false);
    else {
      const isValid = firstPoint.X !== -1 && secondPoint.X !== -1;
      setIsMapLineValid(isValid);
    }
  }, [firstPoint, secondPoint]);

  return { isImageLineValid, isMapLineValid };
};

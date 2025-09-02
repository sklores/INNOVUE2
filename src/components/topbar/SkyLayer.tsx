import React, { useMemo } from "react";
import { TIME } from "./tuning";

const SkyLayer: React.FC = () => {
  const hour = new Date().getHours();
  const isDay = hour >= TIME.sunriseHour && hour < TIME.sunsetHour;

  const background = useMemo(() => {
    return isDay
      ? "linear-gradient(180deg, #aee0ff 0%, #cfeaff 55%, #eaf5ff 100%)"
      : "linear-gradient(180deg, #0d274d 0%, #1b3c66 60%, #264b7a 100%)";
  }, [isDay]);

  return <div style={{ position: "absolute", inset: 0, background }} />;
};

export default SkyLayer;
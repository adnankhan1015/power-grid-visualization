import { useState, useEffect } from "react";
import { getPowerGridData } from "../api/data-grid.service";

export const usePowerGridInfo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState(undefined);

  const colorMap = {
    Main: "#B798F5",
    Solar: "#02E10C",
    DG: "#403F3D",
    Battery: "#FDE602",
    "Solar+Battery": "#86B0FF",
    "Battery+Solar": "#86B0FF",
    "Main+Solar": "#7243D0",
    "Main+Battery": "#32864B",
    "Main+Solar+Battery": "#8BC486",
    "DG+Battery": "magenta",
    "DG+Solar+Battery": "cyan",
    "DG+Battery+Solar": "cyan",
    "DG+Solar": "tomato",
    Undetermined: "#BBE3FD",
    "Missing Data": "white",
  };

  const getChartData = async () => {
    setIsLoading(true);
    const apiData = await getPowerGridData();
    if (apiData !== null) {
      setData(apiData?.data);
    } else {
      setIsError(true);
    }
    setIsLoading(false);
  };

  // When component renders
  useEffect(() => {
    getChartData();
  }, []);

  return {
    isLoading,
    isError,
    data,
    colorMap,
  };
};

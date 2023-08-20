import React, { useEffect } from "react";
import { usePowerGridInfo } from "../hooks";

const ChartContainer = () => {
  const { isError, isLoading, colorMap, data: chartData } = usePowerGridInfo();

  return (
    <>
      {isLoading ? (
        <>Loading...</>
      ) : isError ? (
        <>Sorry! Couldn't fetch record</>
      ) : (
        <div id="chart-container" style={{ width: "100%", height: "500px" }} />
      )}
    </>
  );
};

export default ChartContainer;

import React, { useEffect } from "react";
import { usePowerGridInfo } from "../hooks";
import * as echarts from "echarts";

const ChartContainer = () => {
  const { isError, isLoading, colorMap, data: chartData } = usePowerGridInfo();

  const renderChart = () => {
    // Map Chart onto 'chart-container' div
    const chart = echarts.init(document.getElementById("chart-container"));

    const xAxisData = Array.from({ length: 288 }, (_, index) => {
      const hour = Math.floor(index / 12);
      const minute = (index % 12) * 5;
      return `${hour}:${minute < 10 ? "0" : ""}${minute}`;
    }); // 5-minute intervals

    const yAxisData = []; // Array to store y-axis data (dates)
    const seriesData = [];

    // Process chartData and populate yAxisData and seriesData
    chartData.forEach((dataPoint) => {
      const timestamp = dataPoint.minute_window;
      const date = new Date(timestamp);
      const yAxisLabel = date.toISOString().split("T")[0]; // Extract the date part
      let yIndex = yAxisData.indexOf(yAxisLabel);

      if (yIndex === -1) {
        yAxisData.push(yAxisLabel);
        yIndex = yAxisData.length - 1;
      }

      const xIndex = date.getHours() * 12 + Math.floor(date.getMinutes() / 5);
      // Mapping numbers
      seriesData.push([
        xIndex,
        yIndex,
        Object.keys(colorMap).indexOf(dataPoint.sourceTag),
      ]);
    });

    // Echart configuration
    const option = {
      tooltip: {
        formatter: (params) => {
          const { data } = params;
          const [date, minute_window, sourceTag] = data;

          // Rerverse mapping data points from series data on line number 33
          const color = Object.values(colorMap)[sourceTag];
          const name = Object.keys(colorMap)[sourceTag];
          const displayDate = yAxisData[minute_window];
          const displayTimeStamp = xAxisData[date];
          // **** Reverse Mapping End *** //

          // Render on Hover Tooltip
          const colorIcon = `<span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 5px;"></span>`;
          return `${colorIcon} ${name} ${displayDate} ${displayTimeStamp}`;
        },
      },
      dataZoom: [
        // Add dataZoom for expanders
        {
          type: "slider", // Horizontal expander
          xAxisIndex: 0,
          start: 0,
          end: 100,
        },
        {
          type: "slider", // Vertical expander
          yAxisIndex: 0,
          start: 0,
          end: 100,
        },
      ],
      grid: {
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: xAxisData,
      },
      yAxis: {
        type: "category",
        data: yAxisData,
      },
      visualMap: {
        // Add visualMap for color scale
        type: "piecewise", // or 'continuous'
        pieces: Object.keys(colorMap).map((sourceTag, i) => ({
          value: i,
          color: colorMap[sourceTag],
          label: sourceTag,
        })),
        outOfRange: { color: "blue" },
      },
      series: [
        {
          type: "heatmap",
          data: seriesData,
          label: {
            show: false,
          },
          emphasis: {
            itemStyle: {
              borderColor: "#333",
              borderWidth: 1,
            },
          },
        },
      ],
    };
    // Set Options to Echart
    chart.setOption(option);
  };

  // Render Chart when data is available
  useEffect(() => {
    if (chartData?.length > 0) {
      renderChart();
    }
  }, [chartData]);

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

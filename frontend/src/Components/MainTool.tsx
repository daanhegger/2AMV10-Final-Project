import React from "react";
import SetupModalContainer from "./topicsSetup/SetupModalContainer";
import VolumePlot from "./volume/VolumePlot";
import StackedPlot from "./stacked/stackedPlot";
import HeatMapCity from "./heatmap/HeatMapCity";

interface Props {
  window: number;
}
const MainTool: (props: Props) => JSX.Element | null = (props: Props) => {
  const { window } = props;
  if (window === 0) {
    //home screen
    return <VolumePlot />;
  }
  if (window === 1) {
    //stacked plot screen
    return (
      <>
        <StackedPlot />
        <div>
          <HeatMapCity baseColor="#7591ff" />
          <HeatMapCity baseColor="red" />
          <HeatMapCity baseColor="green" />
          <HeatMapCity baseColor="yellow" />
        </div>
      </>
    );
  }

  return null;
};

export default MainTool;

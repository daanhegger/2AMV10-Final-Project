import React from "react";
import SetupModalContainer from "./topicsSetup/SetupModalContainer";
import VolumePlot from "./volume/VolumePlot";
import StackedPlot from "./stacked/stackedPlot";

const MainTool: React.FC = () => {
  return (
    <>
      <VolumePlot />
      <StackedPlot />
      <SetupModalContainer />
    </>
  );
};

export default MainTool;

import React from "react";
import SetupModalContainer from "./topicsSetup/SetupModalContainer";
import VolumePlot from "./volume/VolumePlot";

const MainTool: React.FC = () => {
  return (
    <>
      <VolumePlot></VolumePlot>
      <SetupModalContainer />
    </>
  );
};

export default MainTool;

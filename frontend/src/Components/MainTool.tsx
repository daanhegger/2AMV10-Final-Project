import React from "react";
import VolumePlot from "./volume/VolumePlot";
import SetupModal from "./topicsSetup/SetupModal";

const MainTool: React.FC = () => {
  return (
    <>
      <VolumePlot></VolumePlot>
      <SetupModal />
    </>
  );
};

export default MainTool;

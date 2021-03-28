import React from "react";
import SetupModalContainer from "./topicsSetup/SetupModalContainer";
import VolumePlot from "./volume/VolumePlot";
import StackedPlot from "./stacked/stackedPlot";

interface Props {
  window: number;
}
const MainTool: (props: Props) => (JSX.Element | null) = (props: Props) => {
  const { window } = props;
  if (window === 0){ //home screen
    return (
      <>
        <VolumePlot />
        <SetupModalContainer />
      </>
    );
  }
  if (window === 1){ //stacked plot screen
    return (
      <>
        <StackedPlot />
        <SetupModalContainer />
      </>
    )
  }

  return null;
};

export default MainTool;

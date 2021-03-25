import React from "react";
import VolumePlot from "./volume/VolumePlot";
import StackedPlot from "./stacked/stackedPlot";
import HeatMapCity from "./heatmap/HeatMapCity";
import { Grid } from "@material-ui/core";

const MainTool: React.FC = () => {
  return (
    <div>
      {/* Volume plot for exploration */}
      <VolumePlot />

      {/* Stacked plot for investigation into topics */}
      <StackedPlot />

      {/* Temporary: grid of heatmaps */}
      <div>
        <Grid container>
          <Grid item md={6}>
            <HeatMapCity baseColor="#7591ff" />
          </Grid>
          <Grid item md={6}>
            <HeatMapCity baseColor="red" />
          </Grid>
          <Grid item md={6}>
            <HeatMapCity baseColor="green" />
          </Grid>
          <Grid item md={6}>
            <HeatMapCity baseColor="yellow" />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default MainTool;

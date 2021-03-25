import React, { useState } from "react";
import VolumePlot from "./volume/VolumePlot";
import StackedPlot from "./stacked/stackedPlot";
import HeatMapCity from "./heatmap/HeatMapCity";
import { Box, Grid } from "@material-ui/core";
import DateFilter, { defaultView } from "./DateFilter";
import BinSizeSelector from "./BinSizeSelector";
import { Interval } from "../models";

/**
 * Main part of the tool where all connected interactive visualizations
 * are vertically aligned
 */
const MainTool: React.FC = () => {
  // Timeframe & Binsize settings
  const defaultValues = { amount: 1, unit: "H" };
  const [frequencyType, setFrequencyType] = useState<string>(defaultValues.unit);
  const [frequencyAmount, setFrequencyAmount] = useState<number>(defaultValues.amount);
  const [interval, setInterval] = useState<Interval>({
    start: defaultView.startDate + " " + defaultView.startTime,
    end: defaultView.endDate + " " + defaultView.endTime,
  });

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" margin="0 0 20px">
        <h3 style={{ margin: 0 }}>Choose a timeframe to filter, and a binsize for aggregation</h3>
        <p style={{ margin: 0 }}>These settings are used for all visualizations in the tool</p>
      </Box>

      {/* Plot settings */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Filter date */}
        <DateFilter
          onChange={(start, end) => {
            if (start && end) setInterval({ start, end });
          }}
        ></DateFilter>

        {/* Options for frequency */}
        <BinSizeSelector
          onChange={(amount, type) => {
            setFrequencyType(type);
            setFrequencyAmount(amount);
          }}
          defaultValues={defaultValues}
        />
      </div>

      <Box display="flex" justifyContent="space-between" alignItems="center" style={{ margin: "50px 0 30px" }}>
        <h3 style={{ margin: 0 }}>Volume of messages over time</h3>
        <p style={{ margin: 0 }}>Drag to select a subset, scroll down to inspect your selection</p>
      </Box>

      {/* Volume plot for exploration */}
      <VolumePlot frequencyType={frequencyType} frequencyAmount={frequencyAmount} start={interval.start} end={interval.end} />

      <Box display="flex" justifyContent="space-between" alignItems="center" margin="50px 0 30px">
        <h3 style={{ margin: 0 }}>Compare popularity of topics over time</h3>
        <p style={{ margin: 0 }}>Manage your topics using the sidebar on the right</p>
      </Box>

      {/* Stacked plot for investigation into topics */}
      <StackedPlot />

      <Box display="flex" justifyContent="space-between" alignItems="center" margin="50px 0 30px">
        <h3 style={{ margin: 0 }}>Compare popularity of topics per region</h3>
        <p style={{ margin: 0 }}>Use the time-tools to manage your sliding window</p>
      </Box>

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

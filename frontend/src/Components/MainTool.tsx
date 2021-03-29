import React, { useState } from "react";
import VolumePlot from "./volume/VolumePlot";
import StackedPlot from "./stacked/stackedPlot";
import { Box, Button } from "@material-ui/core";
import DateFilter, { defaultView } from "./DateFilter";
import BinSizeSelector from "./BinSizeSelector";
import { Interval } from "../models";
import HeatMapView from "./heatmap/HeatMapView";
import moment from "moment";

// Convert time units from pd.Grouper to moment
export const freqToMoment: Record<string, "hours" | "minutes"> = { H: "hours", min: "minutes" };

/**
 * Main part of the tool where all connected interactive visualizations
 * are vertically aligned
 */
const MainTool: React.FC = () => {
  // Timeframe & Binsize settings
  const defaultValues = { amount: 1, unit: "H" };
  const [frequencyType, setFrequencyType] = useState<string>(defaultValues.unit);
  const [frequencyAmount, setFrequencyAmount] = useState<number>(defaultValues.amount);
  // selected on stacked plot date
  const [hour, setHour] = useState<string>("");
  const [location, selectLocation] = useState<string>("");

  const [interval, setInterval] = useState<Interval>({
    start: defaultView.startDate + " " + defaultView.startTime,
    end: defaultView.endDate + " " + defaultView.endTime,
  });

  /**
   * Start and end state for stackedPlot + Heatmap
   */
  const [startWindow, setStartWindow] = useState("2020-04-06 00:00:00");
  const endWindow = moment(startWindow).add(frequencyAmount, freqToMoment[frequencyType]).format("YYYY-MM-DD HH:mm:ss");

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
      <StackedPlot
        frequencyType={frequencyType}
        frequencyAmount={frequencyAmount}
        start={interval.start}
        end={interval.end}
        setInterval={(data: string) => setHour(data)}
        location={location}
        startWindow={startWindow}
        endWindow={endWindow}
        setStartWindow={setStartWindow}
      />

      <Box display="flex" justifyContent="space-between" alignItems="center" margin="50px 0 30px">
        <h3 style={{ margin: 0 }}>Compare popularity of topics per region</h3>
        <p style={{ margin: 0 }}>Use the time-tools to manage your sliding window</p>
      </Box>

      {/* Plot settings */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Edit window  */}
        <div style={{ display: "flex" }}>
          <div>
            <table>
              <tr>
                <td>Start</td>
                <td>{moment(startWindow).format("HH:mm D MMM")}</td>
              </tr>
              <tr>
                <td>End</td>
                <td>{moment(endWindow).format("HH:mm D MMM")}</td>
              </tr>
            </table>
          </div>
          <Box mx={1}></Box>
          <Button
            onClick={() => {
              const current = moment(startWindow);
              const next = current.subtract(frequencyAmount, freqToMoment[frequencyType]);
              setStartWindow(next.format("YYYY-MM-DD HH:mm:ss"));
            }}
            disabled={startWindow <= "2020-04-06 00:00:00"}
            variant="outlined"
          >
            Previous step
          </Button>
          <Box mx={1}></Box>
          <Button
            onClick={() => {
              const current = moment(startWindow);
              const next = current.add(frequencyAmount, freqToMoment[frequencyType]);
              setStartWindow(next.format("YYYY-MM-DD HH:mm:ss"));
            }}
            disabled={startWindow >= "2020-04-10 23:00:00"}
            variant="outlined"
          >
            Next step
          </Button>
        </div>

        {/* Options for frequency */}
        <BinSizeSelector
          onChange={(amount, type) => {
            setFrequencyType(type);
            setFrequencyAmount(amount);
          }}
          defaultValues={defaultValues}
        />
      </div>

      {/* Temporary: grid of heatmaps */}
      <HeatMapView
        startWindow={startWindow}
        endWindow={endWindow}
        setStartWindow={setStartWindow}
        frequencyType={frequencyType}
        frequencyAmount={frequencyAmount}
      />
    </div>
  );
};

export default MainTool;

import { Button, Grid } from "@material-ui/core";
import useAxios from "axios-hooks";
import React, { useContext, useState } from "react";
import HeatMapCity from "./HeatMapCity";
import { AppContext } from "../../context/topicsContext";
import moment from "moment";
import { freqToMoment } from "../MainTool";

interface Props {
  frequencyType: string;
  frequencyAmount: number;
  startWindow: string;
  endWindow: string;
  setStartWindow(startWindow: string): void;
  selectedRegion: string | null;
  setRegion(region: string | null): void;
}

const HeatMapView: React.FC<Props> = ({ frequencyType, frequencyAmount, startWindow, endWindow, selectedRegion, setRegion }) => {
  const { topics } = useContext(AppContext);
  const [{ data, error, loading }] = useAxios({
    url: "http://localhost:5000/heatmap",
    params: { freq_type: frequencyType, freq_amount: frequencyAmount },
    method: "POST",
    data: topics,
  });

  if (loading) return <p>Loading data for heatmaps...</p>;
  if (error) return <p>Error fetching data for heatmaps...</p>;

  const dataSorted = new Array(topics.length).fill(0);

  Object.keys(data).forEach((key) => {
    dataSorted[topics.findIndex((t) => t.title === key)] = key;
  });

  return (
    <div>
      <Grid container>
        {dataSorted.map((topicKey) => {
          const topicData = data[topicKey];

          // Get max messages value for topic over complete timeframe
          const maxTopicMessages = Math.max.apply(
            Math,
            topicData.map((row: any) => row.count)
          );

          // Filter relevant rows for the selected timeframe
          const relevantDataForTime = topicData.filter((row: any) => row.time >= startWindow && row.time < endWindow);
          const dataForHeatmap = relevantDataForTime.map((row: any) => ({ neighbourhood: row.location, messages: row.count }));

          // Find topic color
          const currentTopic = topics.find((topic) => topic.title === topicKey);
          const color = currentTopic ? currentTopic.color : "#7591ff";

          return (
            <Grid item md={6} key={topicKey}>
              <h4>Topic: {topicKey}</h4>
              <HeatMapCity data={dataForHeatmap} maxFrequency={maxTopicMessages} baseColor={color} onSelect={setRegion} selectedNH={selectedRegion} />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default HeatMapView;

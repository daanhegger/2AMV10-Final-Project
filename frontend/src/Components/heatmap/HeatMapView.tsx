import { Grid } from "@material-ui/core";
import useAxios from "axios-hooks";
import React, { useContext, useState } from "react";
import HeatMapCity from "./HeatMapCity";
import { AppContext } from "../../context/topicsContext";
import moment from "moment";

interface Props {
  frequencyType: string;
  frequencyAmount: number;
}

// Convert time units from pd.Grouper to moment
const freqToMoment: Record<string, "hours" | "minutes"> = { H: "hours", min: "minutes" };

const HeatMapView: React.FC<Props> = ({ frequencyType, frequencyAmount }) => {
  const { topics } = useContext(AppContext);
  const [{ data, error, loading }] = useAxios({
    url: "http://localhost:5000/heatmap",
    params: { freq_type: frequencyType, freq_amount: frequencyAmount },
    method: "POST",
    data: topics,
  });
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState<string | undefined>(undefined);

  const [timestamp, setTimestamp] = useState("2020-04-06 03:00:00");
  const timestampBinsize = moment(timestamp).add(frequencyAmount, freqToMoment[frequencyType]).format("YYYY-MM-DD HH:mm:ss");

  if (loading) return <p>Loading data for heatmaps...</p>;
  if (error) return <p>Error fetching data for heatmaps...</p>;

  const dataSorted = new Array(topics.length).fill(0);

  Object.keys(data).forEach((key) => {
    dataSorted[topics.findIndex((t) => t.title === key)] = key;
  });

  return (
    <div>
      <div>
        <div>{timestamp}</div>
        <button
          onClick={() => {
            const current = moment(timestamp);
            const next = current.add(frequencyAmount, freqToMoment[frequencyType]);
            setTimestamp(next.format("YYYY-MM-DD HH:mm:ss"));
          }}
        >
          Next hour
        </button>
      </div>
      <Grid container>
        {dataSorted.map((topicKey) => {
          const topicData = data[topicKey];

          // Get max messages value for topic over complete timeframe
          const maxTopicMessages = Math.max.apply(
            Math,
            topicData.map((row: any) => row.count)
          );

          // Filter relevant rows for the selected timeframe
          const relevantDataForTime = topicData.filter((row: any) => row.time >= timestamp && row.time < timestampBinsize);
          const dataForHeatmap = relevantDataForTime.map((row: any) => ({ neighbourhood: row.location, messages: row.count }));

          // Find topic color
          const currentTopic = topics.find((topic) => topic.title === topicKey);
          const color = currentTopic ? currentTopic.color : "#7591ff";

          return (
            <Grid item md={6} key={topicKey}>
              <HeatMapCity
                data={dataForHeatmap}
                maxFrequency={maxTopicMessages}
                baseColor={color}
                onSelect={(nh) => setSelectedNeighbourhood(nh)}
                selectedNH={selectedNeighbourhood}
              />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default HeatMapView;

import React from "react";
import { Card } from "@material-ui/core";
import useAxios from "axios-hooks";
import Chart from "./Components/makeChart";
import Grid from "@material-ui/core/Grid";
import { SelectWordsCard } from "./Components/selectWords";
import { SetAlgoParamsCard } from "./Components/setAlgoParams";
import VolumePlot from "./Components/volume/VolumePlot";

//Dummie data for the line/scatter chart
const labels = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const dataDummies = [5, 9, 3, 5, 2, 3, 1];

function App() {
  const algoChoices = ["k-NN", "algo-2", "alg-3"];

  const [{ data, loading, error }] = useAxios("http://localhost:5000/word2vec");

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error!</p>;

  // Dummie words. Need to be changed with the most frequent names/topics from the actual data.
  const words = [
    "word 1",
    "word 2",
    "word 3",
    "word 4",
    "word 5",
    "word 6",
    "word 7",
    "word 8",
    "word 9",
    "word 10",
  ];

  const dataForScatter = data.map((row: any[]) => ({
    x: parseFloat(row[0]),
    y: parseFloat(row[1]),
  }));

  const dataWords = data.map((row: any[]) => row[2]);

  return (
    <div className="App" style={{ marginTop: "4em" }}>
      <VolumePlot></VolumePlot>

      <Grid container spacing={2}>
        <Grid item xs={9}>
          <div>
            <Card className="vectorized-words-charts">
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Chart
                    type={"line"}
                    ctx={"lineChart"}
                    labels={labels}
                    chartData={dataDummies}
                    backgroundColor={"#FF9191"}
                    chartLabel={"occurance"}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Chart
                    labels={dataWords}
                    type={"scatter"}
                    ctx={"scatterChart"}
                    chartData={dataForScatter}
                    backgroundColor={"#AEBBFF"}
                    chartLabel={"occurance"}
                  />
                </Grid>
              </Grid>
            </Card>
          </div>
        </Grid>
        <Grid item xs={3}>
          <div>
            <SetAlgoParamsCard algoChoices={algoChoices} />
            <SelectWordsCard words={words} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;

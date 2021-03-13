import React from "react";
import { Card } from "@material-ui/core";
import Chart from "./makeChart";
import Grid from "@material-ui/core/Grid";
import { SelectWordsCard } from "./selectWords";
import VolumePlot from "./volume/VolumePlot";
import useAxios from "axios-hooks";

const MainTool: React.FC = () => {

  const [{ data, loading, error }] = useAxios("http://localhost:5000/word2vec");

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error!</p>;

  const dataForScatter = data.map((row: any[]) => ({
    x: parseFloat(row[0]),
    y: parseFloat(row[1]),
  }));

  const dataWords = data.map((row: any[]) => row[2]);
  return (
    <>
      <VolumePlot></VolumePlot>

      <Grid container spacing={2}>
        <Grid item xs={9}>
          <div>
            <Card className="vectorized-words-charts">
              <Grid container spacing={3}>
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
            <SelectWordsCard
              words={new Array(10).map((_, i) => `word ${i + 1}`)}
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default MainTool;

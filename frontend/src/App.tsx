import React from 'react';
import useAxios from "axios-hooks"
import LineChart from "./Components/lineChart";
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';

function App() {
  const [{ data, loading, error }] = useAxios(
      'http://localhost:5000'
  )

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error!</p>

  //Dummie data for the line chart
  const labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const dataDummies = [5, 9, 3, 5, 2, 3, 1];
  const lineColor = "#FF9191";
  const line = "occurance"
  const ctx = 'myChart';

  return (
    <div className="App">
        <Grid container spacing={3}>
          <Grid item xs={4}>

            <LineChart
              labels={labels}
              chartData={dataDummies}
              backgroundColor={lineColor}
              chartLabel={line}
            />

          </Grid>
          <Grid item xs={2}>

            Here we place the params
            <Slider value={1} aria-labelledby="continuous-slider" />

          </Grid>
        </Grid>
    </div>
  );
};

export default App;

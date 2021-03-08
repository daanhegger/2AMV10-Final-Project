import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, makeStyles } from "@material-ui/core";
import useAxios from "axios-hooks"
import Chart from "./Components/makeChart";
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';

function App() {
  const [{ data, loading, error }] = useAxios(
      'http://localhost:5000'
  )

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error!</p>

  const paramsTitle = (
      <Typography variant="h6" component="h1">
        Params
      </Typography>
  );

  const GreenCheckbox = withStyles({
    root: {
      color: "#FF9191",
      '&$checked': {
        color: "#FF9191",
      },
    },
    checked: {},
  })((props: CheckboxProps) => <Checkbox color="default" {...props} />);

  // Dummie words. Need to be changed with the most frequent names/topics from the actual data.
  const words = ['word 1', 'word 2', 'word 3', 'word 4', 'word 5', 'word 6', 'word 7', 'word 8', 'word 9', 'word 10'];

  const renderCheckboxes = () => {
      return (
          <div>
            {words.map(word => (
              <FormControlLabel
                  control={<GreenCheckbox checked={false} name="checkedG"/>}
                  label={word}
              />
              ))}
          </div>
      )
  };

  //Dummie data for the line/scatter chart
  const labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const dataDummies = [5, 9, 3, 5, 2, 3, 1];

  let dataDummies2 = []
  for(let i = 0; i<1000; i++) {
    dataDummies2.push({x:Math.random()*Math.floor(10), y:Math.random()*Math.floor(10)})
  }

  return (
    <div className="App">
        <Grid container spacing={3}>
          <Grid item xs={4}>

            <Chart
                type={'line'}
                ctx={'lineChart'}
                labels={labels}
                chartData={dataDummies}
                backgroundColor={"#FF9191"}
                chartLabel={"occurance"}
            />

          </Grid>
          <Grid item xs={2}>

            {paramsTitle}
            <Slider value={1} aria-labelledby="continuous-slider" />
            {renderCheckboxes()}

          </Grid>
          <Grid item xs={4}>

            <Chart
                type={'scatter'}
                ctx={'scatterChart'}
                chartData={dataDummies2}
                backgroundColor={"#AEBBFF"}
                chartLabel={"occurance"}
            />

          </Grid>
          <Grid item xs={2}>

            {paramsTitle}
            <Slider value={1} aria-labelledby="continuous-slider" />
            {renderCheckboxes()}

          </Grid>
        </Grid>
    </div>
  );
};

export default App;

import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Card, Typography } from "@material-ui/core";
import useAxios from "axios-hooks";
import Chart from "./Components/makeChart";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";

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

let dataDummies2: any[] = [];
for (let i = 0; i < 1000; i++) {
  dataDummies2.push({
    x: Math.random() * Math.floor(10),
    y: Math.random() * Math.floor(10),
  });
}

function App() {
  const [{ data, loading, error }] = useAxios("http://localhost:5000");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  // const paramsTitle = (
  //     <Typography variant="h6" component="h1">
  //       Params
  //     </Typography>
  // );

  const GreenCheckbox = withStyles({
    root: {
      color: "#ff9191",
      "&$checked": {
        color: "#FF9191",
      },
    },
    checked: {},
  })((props: CheckboxProps) => <Checkbox color="default" {...props} />);

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

  const renderCheckboxesCard = () => {
    return (
      <div>
        {words.map((word) => (
          <FormControlLabel
            control={<GreenCheckbox checked={false} name="checkedG" />}
            label={word}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="App">
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
                    type={"scatter"}
                    ctx={"scatterChart"}
                    chartData={dataDummies2}
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
            <Card className="set-vectorized-parameters">
              {/*set parameters for vectorization*/}
              {renderCheckboxesCard()}
            </Card>
            <Card className="set-words-topics" style={{ marginTop: "3em" }}>
              {renderCheckboxesCard()}
            </Card>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;

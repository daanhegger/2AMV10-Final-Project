import React, {useCallback, useMemo, useState} from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    Card,
    CardContent,
    CardHeader,
    Input,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@material-ui/core";
import useAxios from "axios-hooks"
import Chart from "./Components/makeChart";
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';

function App() {
    const [vectorization, setVectorApproach] = useState('k-NN');
    const selectAlgorithm = useCallback((e) => setVectorApproach(e.target.value as string), [setVectorApproach])


    const [numberOfNeighbors, setNumOfNeighbors] = useState(4)
    const setNumberOfNeighbors = useCallback((e) => setNumOfNeighbors(e.target.value as number), [setNumOfNeighbors]);
    const knnParamsOn = useMemo(() => vectorization === 'k-NN' ? 'inline' : 'none', [vectorization])

    const [topicsList, setTopicList] = useState([]);
    const handleChange = useCallback((e) => setTopicList(e.target.value), [setTopicList]);

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };


    const algoChoices = ['k-NN', 'algo-2', 'alg-3']


    const [{ data, loading, error }] = useAxios(
        'http://localhost:5000'
    )

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error!</p>


  const GreenCheckbox = withStyles({
    root: {
      color: "#ff9191",
      '&$checked': {
        color: "#FF9191",
      },
    },
    checked: {},
  })((props: CheckboxProps) => <Checkbox color="default" {...props} />);

  // Dummie words. Need to be changed with the most frequent names/topics from the actual data.
  const words = ['word 1', 'word 2', 'word 3', 'word 4', 'word 5', 'word 6', 'word 7', 'word 8', 'word 9', 'word 10'];

  const renderCheckboxesCard = () => {
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
      <div className="App" style={{marginTop: "4em"}}>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <div>
              <Card className="vectorized-words-charts">
                <Grid container spacing={3}>
                  <Grid item xs={6}>

                    <Chart
                        type={'line'}
                        ctx={'lineChart'}
                        labels={labels}
                        chartData={dataDummies}
                        backgroundColor={"#FF9191"}
                        chartLabel={"occurance"}
                    />

                  </Grid>
                  <Grid item xs={6}>
                    <Chart
                        type={'scatter'}
                        ctx={'scatterChart'}
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
                <CardHeader title="Select algorithm for vectorization"/>
                <CardContent>
                 <InputLabel id="set-vectorized-approach">Algorithm</InputLabel>
                    <Select
                      labelId="set-vectorized-approach"
                      id="select-algo"
                      value={vectorization}
                      onChange={selectAlgorithm}
                      style={{width: "20%", marginRight: '2em'}}
                    >
                      {algoChoices.map(choice => <MenuItem value={choice}>{choice}</MenuItem>)}
                    </Select>
                    <TextField id="set-kNN-params" value={numberOfNeighbors}
                               style={{width: "20%", display: knnParamsOn}} onChange={setNumberOfNeighbors}/>

                  </CardContent>
              </Card>
              <Card className="set-words-topics" style={{marginTop: "3em"}}>
                  <CardHeader title="Select words for future investigation"/>
                    <InputLabel id="dselect-topics-list" style={{marginLeft: "1em"}}>Topics</InputLabel>
                    <Select
                        labelId="demo-mutiple-name-label"
                        id="demo-mutiple-name"
                        multiple
                        value={topicsList}
                        onChange={handleChange}
                        input={<Input />}
                        MenuProps={MenuProps}
                        style={{marginLeft: "1em", marginBottom: "2em"}}
                    >
                        {words.map((name) => (
                            <MenuItem key={name} value={name}>{name}</MenuItem>
                        ))}
                    </Select>
              </Card>
            </div>
          </Grid>
        </Grid>
      </div>
  );
};

export default App;

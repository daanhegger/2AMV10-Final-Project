import React, {useContext, useEffect, useMemo, useState} from "react";
import axios from "axios";
import Plot from 'react-plotly.js';
import {AppContext} from "../../context/topicsContext";
import {TextField} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";

/**
 * Map Flask object response to coordinate-array
 */
type Coord = { x: number | Date | string; y: number};

const dataMapper = (data: any, term: any): Coord[] =>
    data.map((data_row: any) => ({

        x: new Date(parseInt(data_row.time)),
        y: data_row[term.title],
    }));
const transformDataset = (datasets: any[]) => {
  const data: { name: any; x: any[]; y: any[]; marker: any; xaxis: string; yaxis: string; type: string; hoverinfo: string}[] = []
  datasets.forEach((dataset: any, index: number) => {
    const x: any[] = [];
    const y: any[] = [];
    const label = dataset.label
    dataset.data.forEach( (tuple: any) => {
      x.push(tuple.x);
      y.push(tuple.y);
    })
    data.push({
      name: label,
      x: x,
      y: y,
      marker: {color: dataset.color},
      xaxis: `x`,
      yaxis: `y${index+1}`,
      type: 'scatter',
      hoverinfo: 'text+x+y',
    })
  })
  console.log(data)
  return data
}

const locationList = [
  'Broadview',
  'Chapparal',
  'Cheddarford',
  'Downtown',
  'East Parton',
  'Easton',
  'Northwest',
  'Oak Willow',
  'Old Town',
  'Palace Hills',
  'Pepper Mill',
  'Safe Town',
  'Scenic Vista',
  'Southton',
  'Southwest',
  'Terrapin Springs',
  'West Parton',
  'Weston',
  'Undefined'
]

/**
 * Plot frequency of messages over time
 */
const StakedPlot: React.FC = () => {
  const { topics } = useContext(AppContext);

  const { frequencyType, frequencyAmount } = useContext(AppContext);
  const [datasets, setDatasets] = useState<any []>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [location, selectLocation] = useState('')

  /**
   * Every time parameters change, reload all datasets
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          topics.map((topic) =>
            axios.get("http://localhost:5000/stacked", {
              params: {
                location: location,
                freq_type: frequencyType,
                freq_amount: frequencyAmount,
                topics: JSON.stringify(topic),
              },
            })
          )
        );
        
        var data: any[] = []

        if(topics){
            responses.map(response => (
              topics.forEach(topic => {
                console.log(response)
                if (data.filter(data => data.label === topic.title).length === 0 && response.data[0][topic.title]){
                  data.push({label: topic.title, data: dataMapper(response.data, topic), color: topic.color})
                }
              })
            ))
        }

        setDatasets(transformDataset(data))

      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [topics, frequencyType, frequencyAmount, location]);

  /**
   * Network handlers
   */
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  const setSubPlots = datasets.map((_, index: number) => `xy${index}`)

  // var plot = document.getElementById("stacked-plots")
  // plot.on( 'plotly_hover',function (eventdata: any){
  //       if(eventdata.yvals)
  //       {
  //         console.log(eventdata.yvals);
  //           Plot.Fx.hover(plot, {yval:eventdata.xyvals[0] }, setSubPlots);
  //       }
  //   })

  return (
    <div>
      <Autocomplete
          value={location}
          onChange={(_, newValue) => (selectLocation(newValue || ''))}
          options={locationList}
          renderInput={(params) => <TextField {...params} label="Filter on location" variant="outlined" />}
      />
        <Plot id="stacked-plots"
        data={datasets}
        layout={{grid: {rows: datasets.length, columns: 1, subplots: setSubPlots}, width: 1230} }
      />
    </div>

  );
};

export default StakedPlot;

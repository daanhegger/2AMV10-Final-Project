import React, {useContext, useEffect, useMemo, useState} from "react";
import axios from "axios";
import Plot from 'react-plotly.js';
import {AppContext} from "../../context/topicsContext";
import {Input, Select, MenuItem, FormControl, InputLabel} from "@material-ui/core";

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
  const data: { name: any; x: any[]; y: any[]; stackgroup: string; groupnorm: string }[] = []
  datasets.forEach(dataset => {
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
      stackgroup: 'one',
      groupnorm:'percent'
    })
  })
  return data
}

const locationList = [
  'No location',
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
  'Weston'
]

/**
 * Plot frequency of messages over time
 */
const StakedPlot: React.FC = () => {
  const { topics } = useContext(AppContext);
  const defaultValues = useMemo(() => ({ amount: 1, unit: "H" }), []);
  const [datasets, setDatasets] = useState<any []>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [location, selectLocation] = useState('all')
    const handleChange = (event: any) => {
    selectLocation(event.target.value);
  };

 //  '<Location with-held due to contract>' 'Broadview' 'Chapparal'
 // 'Cheddarford' 'Downtown' 'East Parton' 'Easton' 'Northwest' 'Oak Willow'
 // 'Old Town' 'Palace Hills' 'Pepper Mill' 'Safe Town' 'Scenic Vista'
 // 'Southton' 'Southwest' 'Terrapin Springs' 'West Parton' 'Weston'


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
                freq_type: defaultValues.unit,
                freq_amount: defaultValues.amount,
                topics: JSON.stringify(topic),
              },
            })
          )
        );
        
        var data: any[] = []

        if(topics){
            responses.map(response => (
              topics.forEach(topic => {
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
  }, [topics, defaultValues]);

  /**
   * Network handlers
   */
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <div>
      {/*<FormControl>*/}
      {/*  <InputLabel id="demo-mutiple-name-label">Name</InputLabel>*/}
      {/* <Select*/}
      {/*    labelId="demo-mutiple-name-label"*/}
      {/*    id="demo-mutiple-name"*/}
      {/*    multiple*/}
      {/*    value={location}*/}
      {/*    onChange={handleChange}*/}
      {/*    input={<Input />}*/}
      {/*  >*/}
      {/*    {locationList.map((name) => (*/}
      {/*      <MenuItem*/}
      {/*        key={name}*/}
      {/*        value={name}*/}
      {/*      >*/}
      {/*        {name}*/}
      {/*      </MenuItem>*/}
      {/*    ))}*/}
      {/*  </Select>*/}
      {/*</FormControl>*/}

      {/* React version of chart.j for easy plotting */}
      <Plot
        data={datasets}
        layout={ {width: 1230, height: 700 } }
      />
    </div>

  );
};

export default StakedPlot;

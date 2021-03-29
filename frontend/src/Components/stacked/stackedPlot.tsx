import React, {useCallback, useContext, useEffect, useState} from "react";
import axios from "axios";
import Plot from 'react-plotly.js';
import {AppContext} from "../../context/topicsContext";
import {Interval} from "../../models";

/**
 * Map Flask object response to coordinate-array
 */
interface Props {
  frequencyType: string;
  frequencyAmount: number;
  interval?: Interval;
  start: string;
  end: string;
  setInterval(data: string) : void;
  location: string;
}

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

  return data
}

/**
 * Plot frequency of messages over time
 */
const StakedPlot: React.FC<Props> = ({ frequencyType, frequencyAmount, start, end, interval, setInterval , location}) => {
  const { topics } = useContext(AppContext);

  const [datasets, setDatasets] = useState<any []>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [selected, setSelected] = useState( interval || {start: '0', end: '0'})

  const [shapes, setShapes] = useState(datasets.map((dataset, index: number) => ({ type: 'line', xref: 'x', yref: `y${index + 1}`, x0: selected.start, y0: 0, x1: selected.start, y1: Math.max.apply(Math, dataset.y), line: {color: 'rgb(55, 128, 191)', width: 3}})))

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

  useEffect(() => (
    setShapes(datasets.map((dataset, index: number) => ({
                        type: 'line',
                        xref: 'x',
                        yref: `y${index + 1}`,
                        x0: selected.start,
                        y0: 0,
                        x1: selected.start,
                        y1: Math.max.apply(Math, dataset.y),
                        line: {
                          color: 'rgb(55, 128, 191)',
                          width: 3
                        }
                      })))
  ), [selected])

  const selectedDate = useCallback((event: any) => {
    setSelected({start: event.points[0].x, end: event.points[0].x})
    setInterval(event.points[0].x);
  }, [])

  /**
   * Network handlers
   */
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  const setSubPlots = datasets.map((_, index: number) => `xy${index}`)

  return (
    <div>
        <Plot id="stacked-plots"
              data={datasets}
              layout={{grid: {rows: datasets.length, columns: 1, subplots: setSubPlots}, width: 1230, height: 200 * datasets.length,
                      xaxis: { range: [start, end] }, shapes: shapes}
              }
              onClick={(event: any) => selectedDate(event)}
      />
    </div>

  );
};

export default StakedPlot;

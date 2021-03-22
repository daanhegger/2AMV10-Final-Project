import React, {useContext, useEffect, useMemo, useState} from "react";
import axios from "axios";
import Plot from 'react-plotly.js';
import {AppContext} from "../../context/topicsContext";

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

/**
 * Plot frequency of messages over time
 */
const StakedPlot: React.FC = () => {
  const { topics } = useContext(AppContext);
  const defaultValues = useMemo(() => ({ amount: 1, unit: "H" }), []);
  const [datasets, setDatasets] = useState<any []>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);


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

      {/* React version of chart.j for easy plotting */}
      <Plot
        data={datasets}
        layout={ {width: 1230, height: 700 } }
      />
    </div>

  );
};

export default StakedPlot;

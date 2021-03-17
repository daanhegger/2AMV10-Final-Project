import React, {useEffect, useState} from "react";
import axios from "axios";
import DateFilter from "../DateFilter";
import BinSizeSelector from "../BinSizeSelector";
import Plot from 'react-plotly.js';

/**
 * Map Flask object response to coordinate-array
 */
type Coord = { x: number | Date | string; y: number };

const dataMapper = (data: any, term: any): Coord[] =>
    data.map((data_row: any) => ({
        x: new Date(parseInt(data_row.time)),
        y: data_row[term],
    }));

const transformDataset = (datasets: any[]) => {
  const data: { name: any; x: any[]; y: any[]; stackgroup: string, groupnorm: string  }[] = []
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
   // Binsize settings
  const defaultValues = { amount: 1, unit: "H" };
  const [frequencyType, setFrequencyType] = useState<string>(defaultValues.unit);
  const [frequencyAmount, setFrequencyAmount] = useState<number>(defaultValues.amount);

  // Each search actions is a list of words, multiple actions allowed so 2d array
  const [searchTerms, setSearchTerms] = useState<string[][]>([[]]);
  const [datasets, setDatasets] = useState<any []>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const reference: any = React.createRef();
  useEffect(() => {
    async function init() {
      window.addEventListener('storage', () => {
        setSearchTerms(JSON.parse(localStorage.getItem('topicsList')||'[]'));
      })};
    init();}, [])


  function updateConfigByMutating(chart: any, start?: string, end?: string) {
    let lineChart = chart.current.chartInstance;

    lineChart.config.options.scales = {
      xAxes: [
        {
          type: "time",
          position: "bottom",
          ticks: {
            min: start, //e.g. "2020-04-09 01:58:00"
            max: end,
          },
          time: {
            displayFormats: {
              hour: "HH:MM",
            },
          },
        },
      ],
    };

    lineChart.update();
  }

  /**
   * Every time parameters change, reload all datasets
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          searchTerms.map((termGroup) =>
            axios.get("http://localhost:5000/stacked", {
              params: {
                freq_type: frequencyType,
                freq_amount: frequencyAmount,
                topics: JSON.stringify(termGroup),
              },
            })
          )
        );
        
        var data: any[] = []
        console.log(searchTerms[0].length)
        if(searchTerms[0].length > 0){
            responses.map(response => {
              searchTerms.forEach(term => data.push({label: term, data: dataMapper(response.data, term)}))
            })
        }

        // for test purpose
        responses.map(response => {
                      ["Fire & Smoke", "Water & Flood"].forEach(term => data.push({label: term, data: dataMapper(response.data, term)}))
        })

        setDatasets(transformDataset(data))

      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [frequencyType, frequencyAmount, searchTerms]);

  /**
   * Network handlers
   */
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {/* Plot settings */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* Filter date */}
          <DateFilter
            onChange={(start, end) => {
              updateConfigByMutating(reference, start, end);
            }}
          ></DateFilter>

          {/* Options for frequency */}
          <BinSizeSelector
            onChange={(amount, type) => {
              setFrequencyType(type);
              setFrequencyAmount(amount);
            }}
            defaultValues={defaultValues}
          />
        </div>
      </div>

      {/* React version of chart.j for easy plotting */}
      <Plot
        data={datasets}
        layout={ {width: 1230, height: 700 } }
      />
    </div>

  );
};

export default StakedPlot;

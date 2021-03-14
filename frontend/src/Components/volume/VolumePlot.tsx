import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import DateFilter from "../DateFilter";
import SearchControls from "./SearchControls";
import BinSizeSelector from "../BinSizeSelector";

type Coord = { x: number | Date | string; y: number };

/**
 * Map Flask object response to coordinate-array
 */
const dataMapper = (data: Record<string, number>): Coord[] =>
  Object.keys(data).map((key, i) => ({
    x: new Date(parseInt(key)),
    y: data[key],
  }));

/**
 * Plot frequency of messages over time
 */
const VolumePlot: React.FC = () => {
  // Binsize settings
  const defaultValues = { amount: 1, unit: "H" };
  const [frequencyType, setFrequencyType] = useState<string>(defaultValues.unit);
  const [frequencyAmount, setFrequencyAmount] = useState<number>(defaultValues.amount);

  // Each search actions is a list of words, multiple actions allowed so 2d array
  const [searchTerms, setSearchTerms] = useState<string[][]>([[]]);
  const [datasets, setDatasets] = useState<Chart.ChartDataSets[]>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const reference: any = React.createRef();

  /**
   * Add a new set of search terms to the list
   */
  const addSearchTerms = (terms: string[]) => {
    setSearchTerms([...searchTerms, terms]);
  };

  /**
   * Remove a set of search terms from the list
   */
  const removeSearchTerms = (terms: string[]) => {
    setSearchTerms(searchTerms.filter((currentTerms) => currentTerms.join("") !== terms.join("")));
  };

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
            axios.get("http://localhost:5000/volume", {
              params: {
                freq_type: frequencyType,
                freq_amount: frequencyAmount,
                search_terms: JSON.stringify(termGroup),
              },
            })
          )
        );

        setDatasets(
          responses.map((response, i) => ({
            label: searchTerms.length ? searchTerms[i].join(", ") : "Complete set",
            data: dataMapper(response.data),
          }))
        );
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
        {/* Text search bar */}
        <SearchControls onAdd={addSearchTerms}></SearchControls>

        {/* Display all the search groups, click to delete */}
        <div>
          <p>Searching for term groups:</p>
          <ul>
            {searchTerms.map((terms) => (
              <li key={terms.join(", ")} onClick={() => removeSearchTerms(terms)}>
                {terms.length > 0 ? terms.join(", ") : "Complete set (default)"}
              </li>
            ))}
          </ul>
          <button onClick={() => addSearchTerms([])}>Add complete set</button>

          {/* Select the desired timespan of the volume graph */}
        </div>

        <div style={{ height: 20 }}></div>

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

      {/* React version of chart.js for easy plotting */}
      <Line
        data={{
          datasets: datasets ? datasets.map((d) => ({ ...d, backgroundColor: "rgb(65,83,175, 0.1)", borderColor: "rgb(65,83,175,0.6)" })) : [],
        }}
        options={{
          scales: {
            xAxes: [
              {
                type: "time",
                position: "bottom",
                time: {
                  displayFormats: {
                    hour: "HH:MM D MMM",
                  },
                  stepSize: 4,
                },
              },
            ],
          },
        }}
        ref={reference}
      />
    </div>
  );
};

export default VolumePlot;

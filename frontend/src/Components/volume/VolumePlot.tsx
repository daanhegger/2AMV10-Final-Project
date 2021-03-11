import { MenuItem, Select, TextField } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import SearchControls from "./SearchControls";

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
  const [frequencyType, setFrequencyType] = useState<string>("min");
  const [frequencyAmount, setFrequencyAmount] = useState<number>(60);
  // Each search actions is a list of words, multiple actions allowed so 2d array
  const [searchTerms, setSearchTerms] = useState<string[][]>([[]]);
  const [datasets, setDatasets] = useState<Chart.ChartDataSets[]>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

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
    setSearchTerms(
      searchTerms.filter(
        (currentTerms) => currentTerms.join("") !== terms.join("")
      )
    );
  };

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
            label: searchTerms.length
              ? searchTerms[i].join(", ")
              : "Complete set",
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Text search bar */}
        <SearchControls onAdd={addSearchTerms}></SearchControls>

        {/* Options for frequency */}
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <TextField
            label="Frequency"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            value={frequencyAmount}
            onChange={(e) => setFrequencyAmount(parseInt(e.target.value, 10))}
          />

          <Select
            value={frequencyType}
            onChange={(e) => setFrequencyType(e.target.value as string)}
          >
            <MenuItem value="min">Minute(s)</MenuItem>
            <MenuItem value="H">Hour(s)</MenuItem>
            <MenuItem value="S">Second(s)</MenuItem>
          </Select>
        </div>
      </div>

      {/* Display all the search groups, click to delete */}
      <div>
        <p>Searching for term groups:</p>
        <ul>
          {searchTerms.map((terms) => (
            <li onClick={() => removeSearchTerms(terms)}>
              {terms.length > 0 ? terms.join(", ") : "Complete set (default)"}
            </li>
          ))}
        </ul>
        <button onClick={() => addSearchTerms([])}>Add complete set</button>
      </div>

      {/* React version of chart.js for easy plotting */}
      <Line
        data={{ datasets }}
        options={{
          scales: {
            xAxes: [
              {
                type: "time",
                position: "bottom",
                time: {
                  displayFormats: {
                    hour: "HH:MM",
                  },
                },
              },
            ],
          },
        }}
      ></Line>
    </div>
  );
};

export default VolumePlot;

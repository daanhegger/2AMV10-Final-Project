import { MenuItem, Select, TextField, Button } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {Line} from "react-chartjs-2";
import SearchControls from "./SearchControls";
import {log} from "util";
import moment from "moment";
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

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
  const reference:any = React.createRef();

  //time and date variables for the filter on the volume graph
  const [selected_start_Date, setSelected_start_Date] = useState<Date | null>(
    new Date('2020-04-06T00:00:00'),
  );
  const [selected_start_time, setSelected_start_time] = useState<Date | null>()
  const [selected_end_Date, setSelected_end_Date] = useState<Date | null>(
    new Date('2020-04-09T00:00:00'),
  );
  const [selected_end_time, setSelected_end_time] = useState<Date | null>()

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

  const handle_start_DateChange = (date: Date | null) => {
    setSelected_start_Date(date);
  };

  const handle_end_DateChange = (date: Date | null) => {
    setSelected_end_Date(date);
  };

  const handle_start_timeChange = (date: Date | null) => {
    setSelected_start_time(date);
  };

  const handle_end_timeChange = (date: Date | null) => {
    setSelected_end_time(date);
  };

  function updateConfigByMutating(chart:any, start:string, end:string) {
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
      {/*  /!* Text search bar *!/*/}
      {/*  <SearchControls onAdd={addSearchTerms}></SearchControls>*/}

      {/*  /!* Options for frequency *!/*/}
      {/*  <div style={{ display: "flex", alignItems: "flex-end" }}>*/}
      {/*    <TextField*/}
      {/*      label="Frequency"*/}
      {/*      type="number"*/}
      {/*      InputLabelProps={{*/}
      {/*        shrink: true,*/}
      {/*      }}*/}
      {/*      value={frequencyAmount}*/}
      {/*      onChange={(e) => setFrequencyAmount(parseInt(e.target.value, 10))}*/}
      {/*    />*/}

      {/*    <Select*/}
      {/*      value={frequencyType}*/}
      {/*      onChange={(e) => setFrequencyType(e.target.value as string)}*/}
      {/*    >*/}
      {/*      <MenuItem value="min">Minute(s)</MenuItem>*/}
      {/*      <MenuItem value="H">Hour(s)</MenuItem>*/}
      {/*      <MenuItem value="S">Second(s)</MenuItem>*/}
      {/*    </Select>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*/!* Display all the search groups, click to delete *!/*/}
      {/*<div>*/}
      {/*  <p>Searching for term groups:</p>*/}
      {/*  <ul>*/}
      {/*    {searchTerms.map((terms) => (*/}
      {/*      <li key={terms.join(", ")} onClick={() => removeSearchTerms(terms)}>*/}
      {/*        {terms.length > 0 ? terms.join(", ") : "Complete set (default)"}*/}
      {/*      </li>*/}
      {/*    ))}*/}
      {/*  </ul>*/}
      {/*  <button onClick={() => addSearchTerms([])}>Add complete set</button>*/}

        {/* Select the desired timespan of the volume graph*/}
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around">
            <p>Timespan:</p>
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Start date"
              format="MM/dd/yyyy"
              value={selected_start_Date}
              onChange={handle_start_DateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              label="Start time"
              value={selected_start_time}
              onChange={handle_start_timeChange}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="End date"
              format="MM/dd/yyyy"
              value={selected_end_Date}
              onChange={handle_end_DateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              label="End time"
              value={selected_end_time}
              onChange={handle_end_timeChange}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
            <Button variant="contained" color="primary" onClick={() => updateConfigByMutating(
              reference,
              moment(selected_start_Date).format('YYYY-MM-DD').concat(' ', moment(selected_start_time).format('HH:mm:ss')),
              moment(selected_end_Date).format('YYYY-MM-DD').concat(' ', moment(selected_end_time).format('HH:mm:ss')),
            )}>Apply</Button>
          </Grid>
        </MuiPickersUtilsProvider>
      </div>

      {/* React version of chart.js for easy plotting */}
      <Line
        data={{datasets}}
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
        ref={reference}
      />
    </div>
  );
};

export default VolumePlot;

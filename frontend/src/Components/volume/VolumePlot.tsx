import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import DateFilter from "../DateFilter";
import BinSizeSelector from "../BinSizeSelector";
import "chartjs-plugin-zoom";
import { Box } from "@material-ui/core";
import Overlay from "./Overlay";
import { ChartPoint } from "chart.js";
import WordCloud from "./WordCloud";
import moment from "moment";

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

  const [datasets, setDatasets] = useState<Chart.ChartDataSets[]>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [interval, setInterval] = useState<{ start?: string; end?: string } | null>(null);

  // Referece to chartjs instance
  const [reference, setReference] = useState<any>(null);

  function updateConfigByMutating(chart: any, start?: string, end?: string) {
    let lineChart = chart.chartInstance;

    const change = {
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
              hour: "HH:MM D MMM",
            },
            stepSize: 4,
          },
        },
      ],
    };

    lineChart.config.options.scales = change;
    lineChart.update();
  }

  /**
   * Every time parameters change, reload all datasets
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/volume", {
          params: {
            freq_type: frequencyType,
            freq_amount: frequencyAmount,
          },
        });

        setDatasets([
          {
            label: "All tweets",
            data: dataMapper(response.data),
          },
        ]);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [frequencyType, frequencyAmount]);

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

      <Box mt={3} />

      {reference && reference.chartInstance.canvas && (
        <Overlay
          chart={reference.chartInstance}
          onInterval={(start, end) => {
            if (datasets) {
              const ds = datasets[0].data as ChartPoint[];
              if (ds) {
                const startDate = ds[start].x;
                const endDate = ds[end]?.x;
                if (startDate && endDate) {
                  setInterval({ start: moment(startDate).format("YYYY-MM-DD HH:mm:ss"), end: moment(endDate).format("YYYY-MM-DD HH:mm:ss") });
                }
              }
            }
          }}
        />
      )}

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
        ref={(reference) => setReference(reference)}
      />

      {interval && interval.start && interval.end && <WordCloud start={interval.start} end={interval.end} />}
    </div>
  );
};

export default VolumePlot;

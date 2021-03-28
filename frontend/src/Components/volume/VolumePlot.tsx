import React, {useCallback, useContext, useEffect, useState} from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import DateFilter from "../DateFilter";
import BinSizeSelector from "../BinSizeSelector";
import "chartjs-plugin-zoom";
import { Box, Button } from "@material-ui/core";
import Overlay from "./Overlay";
import WordCloud from "./WordCloud";
import moment from "moment";
import CloseIcon from "@material-ui/icons/Close";
import {AppContext} from "../../context/topicsContext";

type Coord = { x: Date; y: number };

/**
 * Map Flask object response to coordinate-array
 */
const dataMapper = (data: Record<string, number>): Coord[] =>
  Object.keys(data).map<Coord>((key, i) => ({
    x: new Date(parseInt(key)),
    y: data[key],
    fillColor: "#FF0000",
  }));

/**
 * Plot frequency of messages over time
 */
const VolumePlot: React.FC = () => {
  // Binsize settings
  const defaultValues = { amount: 1, unit: "H" };
  const { frequencyType, setFrequencyType, frequencyAmount, setFrequencyAmount } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [points, setPoints] = useState<Coord[]>([]);
  const [interval, setInterval] = useState<{ start: string; end: string } | null>(null);

  // Referece to chartjs instance
  const [reference, setReference] = useState<any>(null);

  // useCallback such that the function is not re-generated after each re-render
  // this way the overlay is only re-triggered when needed
  const onInterval = useCallback(
    (start, end) => {
      if (points.length > 0) {
        // Make sure the start date is the earliest date (most left point)
        const startDate = points[start <= end ? start : end].x;
        const endDate = points[end >= start ? end : start].x;

        // Don't allow selection if the window size is 0
        // (both dates are equal)
        // When this happens: clear selection
        if (startDate === endDate) {
          setInterval(null);
          return;
        }

        if (startDate && endDate) {
          setInterval({ start: moment(startDate).format("YYYY-MM-DD HH:mm:ss"), end: moment(endDate).format("YYYY-MM-DD HH:mm:ss") });
        }
      }
    },
    [points]
  );

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

        setPoints(dataMapper(response.data));
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

      <div>
        {/* Overlay for drag-selection */}
        {reference && reference.chartInstance.canvas && <Overlay chart={reference.chartInstance} onInterval={onInterval} />}

        {/* React version of chart.js for easy plotting */}
        <Line
          data={{
            datasets: [
              {
                label: "All tweets",
                data: points,
                backgroundColor: "rgb(65,83,175, 0.1)",
                borderColor: "rgb(65,83,175,0.6)",
                /**
                 * Color the points yellow if they are in the selection
                 */
                pointBackgroundColor: (ctx) => {
                  if (interval && ctx.dataIndex !== undefined) {
                    const p = points[ctx.dataIndex];
                    if (moment(p.x).format("YYYY-MM-DD HH:mm:ss") >= interval.start && moment(p.x).format("YYYY-MM-DD HH:mm:ss") <= interval.end) {
                      return "#FF0000";
                    }
                  }
                  return "rgb(65,83,175, 0.1)";
                },
              },
            ],
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
      </div>

      {interval && (
        <p>
          Selection made between
          <i style={{ textDecoration: "underline" }}>{moment(interval.start).format("HH:MM D MMM")}</i> and{" "}
          <i>{moment(interval.end).format("HH:MM D MMM")}</i>
          <Button
            size="small"
            variant="text"
            onClick={() => {
              setInterval(null);
            }}
            endIcon={<CloseIcon fontSize="small" />}
          >
            Clear selection
          </Button>
        </p>
      )}

      {interval && <WordCloud start={interval.start} end={interval.end} />}
    </div>
  );
};

export default VolumePlot;

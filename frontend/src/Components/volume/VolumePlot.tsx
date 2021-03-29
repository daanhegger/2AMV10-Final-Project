import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chartjs-plugin-zoom";
import { Box, Button } from "@material-ui/core";
import Overlay from "./Overlay";
import WordCloud from "./WordCloud";
import moment from "moment";
import CloseIcon from "@material-ui/icons/Close";
import { Coord } from "../../models";
import { dataMapperToChartjs } from "../../utils/parsers";
import { Interval } from "../../models";
import { Disable } from "react-disable";

interface Props {
  frequencyType: string;
  frequencyAmount: number;
  interval?: Interval;
  start: string;
  end: string;
}

/**
 * Plot frequency of messages over time
 */
const VolumePlot: React.FC<Props> = ({ frequencyType, frequencyAmount, start, end }) => {
  // Datapoints from server
  const [points, setPoints] = useState<Coord[]>([]);

  // HTTP status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [loadingWordCloud, setLoadingWordCloud] = useState(false);

  // (local) Interval for wordcloud only, not for sharing with other plots
  const [interval, setInterval] = useState<Interval | null>(null);

  // Referece to chartjs instance
  const [reference, setReference] = useState<any>(null);

  // useCallback such that the function is not re-generated after each re-render
  // this way the overlay is only re-triggered when needed
  const onInterval = useCallback(
    (startIndex, endIndex) => {
      if (points.length > 0) {
        // Make sure the start date is the earliest date (most left point)
        const startDate = points[startIndex <= endIndex ? startIndex : endIndex].x;
        const endDate = points[endIndex >= startIndex ? endIndex : startIndex].x;

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

        setPoints(dataMapperToChartjs(response.data));
      } catch (e) {
        setError(true);
        setPoints([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [frequencyType, frequencyAmount]);

  useEffect(() => {
    setInterval(null);
  }, [frequencyType, frequencyAmount, start, end]);

  /**
   * Network handlers
   */
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <div>
      <Disable disabled={loadingWordCloud}>
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
            height={100}
            options={{
              legend: {
                display: false,
              },
              scales: {
                xAxes: [
                  {
                    type: "time",
                    position: "bottom",
                    time: {
                      displayFormats: {
                        hour: "D MMM HH:mm",
                      },
                      stepSize: 4,
                    },
                    ticks: {
                      autoSkip: false,
                      maxRotation: 25,
                      minRotation: 25,
                      min: start, //e.g. "2020-04-09 01:58:00"
                      max: end,
                    },
                  },
                ],
              },
            }}
            ref={(reference) => setReference(reference)}
          />
        </div>
      </Disable>

      {/* Helper text and buttons to manage drag selection */}
      {interval && (
        <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
          <p>
            Showing most frequent words from {moment(interval.start).format("HH:mm D MMM")} to {moment(interval.end).format("HH:mm D MMM")}
          </p>
          <div>
            <Button size="small" variant="outlined" onClick={() => setInterval(null)} endIcon={<CloseIcon fontSize="small" />}>
              Clear selection
            </Button>
          </div>
        </Box>
      )}

      {/* When interval selected, show wordcloud */}
      {interval && <WordCloud start={interval.start} end={interval.end} onLoading={(state) => setLoadingWordCloud(state)} />}
    </div>
  );
};

export default VolumePlot;

import React, { useEffect, useState } from "react";

interface Props {
  chart: any;
  onInterval(start: number, end: number): void;
}

const Overlay: React.FC<Props> = ({ chart, onInterval }) => {
  const [canvasRef, setCanvasRef] = useState<any>();

  /**
   * Register drag events, and keep track of selection
   * Also draw rectangle
   */
  useEffect(() => {
    if (canvasRef) {
      var canvas = chart.canvas as HTMLCanvasElement;
      var overlay = document.getElementById("volume-plot-overlay") as any;
      var startIndex = 0;
      var selectionContext = overlay?.getContext("2d");
      var selectionRect = {
        w: 0,
        startX: 0,
        startY: 0,
      };
      var drag = false;

      canvas.addEventListener("pointerdown", (evt: any) => {
        const points = chart.getElementsAtEventForMode(evt, "index", {
          intersect: false,
        });
        startIndex = points[0]._index;
        const rect = canvas.getBoundingClientRect();
        selectionRect.startX = evt.clientX - rect.left;
        selectionRect.startY = chart.chartArea.top;
        drag = true;
        // save points[0]._index for filtering
      });

      canvas.addEventListener("pointermove", (evt: any) => {
        const rect = canvas.getBoundingClientRect();
        if (drag) {
          const rect = canvas.getBoundingClientRect();
          selectionRect.w = evt.clientX - rect.left - selectionRect.startX;
          selectionContext.globalAlpha = 0.5;
          selectionContext.clearRect(0, 0, canvas.width, canvas.height);
          selectionContext.fillRect(selectionRect.startX, selectionRect.startY, selectionRect.w, chart.chartArea.bottom - chart.chartArea.top);
        } else {
          selectionContext.clearRect(0, 0, canvas.width, canvas.height);
          var x = evt.clientX - rect.left;
          if (x > chart.chartArea.left) {
            selectionContext.fillRect(x, chart.chartArea.top, 1, chart.chartArea.bottom - chart.chartArea.top);
          }
        }
      });

      canvas.addEventListener("pointerup", (evt: any) => {
        const points = chart.getElementsAtEventForMode(evt, "index", {
          intersect: false,
        });
        drag = false;
        onInterval(startIndex, points[0]._index);
      });
    }
  }, [canvasRef, chart, onInterval]);

  /**
   * Effect to update canvas size to plot
   */
  useEffect(() => {
    if (canvasRef) {
      var canvas = chart.canvas as HTMLCanvasElement;
      var overlay = document.getElementById("volume-plot-overlay") as any;
      const linePlot = canvas.getBoundingClientRect();
      overlay.width = linePlot.width;
      overlay.height = linePlot.height;
    }
  }, [canvasRef, chart]);

  return (
    <canvas
      ref={(cr) => setCanvasRef(cr)}
      id="volume-plot-overlay"
      width="600"
      height="400"
      style={{ position: "absolute", pointerEvents: "none" }}
    ></canvas>
  );
};

export default Overlay;

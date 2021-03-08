import React, { useEffect } from 'react';
import Chartjs from 'chart.js';

/* LineChart component. It expects the following imput:
*  - type: the type of chart to make (e.g. 'line', 'scatter')
*  - labels: x-axis names.
*  - chartData: the data to plot.
*  - backgroundColor: the color of the line or the data points
*  - chartLabel: name of the data for in the legend.
*  */

const Chart = ({
                   type,
                   ctx,
                   labels,
                   chartData = [],
                   backgroundColor,
                   chartLabel = null,
               }:any) => {

    const data:any = {
        labels,
        datasets: [{
            label: chartLabel,
            data: chartData,
            backgroundColor: backgroundColor,
        }]
    };

    const chartConfig = {
        type: type,
        data: data,
    };

    useEffect(() => {
        new Chartjs(ctx, chartConfig);
    });

    return (
        <div>
            <canvas id={ctx} width="200" height="200"/>
        </div>
    );
};

export default Chart;

import React, { useEffect } from 'react';
import Chartjs from 'chart.js';

/* LineChart component. It expects the following imput:
*  - labels
*  - chartData
*  - backgroundColor
*  - chartLabel
*  */

const LineChart = ({
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
        type: 'line',
        data: data,
    };

    useEffect(() => {
        new Chartjs("myChart", chartConfig);
    });
    return (
        <div>
            <canvas id="myChart" width="200" height="200"/>
        </div>
    );
};

export default LineChart;

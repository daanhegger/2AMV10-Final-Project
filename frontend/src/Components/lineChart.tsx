import React, { useEffect } from 'react';
import Chartjs from 'chart.js';

const LineChart = ({
                   labels,
                   chartData = [],
                   backgroundColor,
                   chartLabel = null,
                   ctx,
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
        new Chartjs(ctx, chartConfig);
    });
    return (
        <div>
            <canvas id="myChart" width="200" height="200"/>
        </div>
    );
};

export default LineChart;

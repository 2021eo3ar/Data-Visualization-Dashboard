import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const LineChart = ({ data, labels, label }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');

    // Destroy previous chart instance, if it exists
    if (chartRef.current.chart) {
      chartRef.current.chart.destroy();
    }

    // Create a new Chart instance
    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label,
            data,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointRadius: 5,
            pointHitRadius: 10,
          },
        ],
      },
      options: {
        scales: {
          y: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'Frequency',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Sector',
            },
          },
        },
      },
    });

    // Store the Chart instance on the ref for later cleanup
    chartRef.current.chart = newChart;
  }, [data, labels, label]);

  return <canvas ref={chartRef} />;
};

export default LineChart;

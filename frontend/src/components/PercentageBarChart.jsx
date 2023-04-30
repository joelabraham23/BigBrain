import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

// Component to display the percentage of players that got each question correct given the data
const PercentageBarChart = ({ data }) => {
  const chartContainer = useRef(null);

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      const chartConfig = {
        type: 'bar',
        data: {
          labels: data.map(d => d.question),
          datasets: [
            {
              label: 'Percentage',
              data: data.map(d => d.percentage),
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 100, // Set maximum value for y-axis to 100%
              ticks: {
                stepSize: 10,
                callback: value => `${value}%`,
              },
            },
          },
        },
      };

      const myChart = new Chart(chartContainer.current, chartConfig);
      return () => {
        myChart.destroy();
      };
    }
  }, [data]);

  return (
    <div>
      <h2>Percentage Correct per Question</h2>
      <canvas ref={chartContainer}></canvas>
    </div>
  );
};

export default PercentageBarChart;

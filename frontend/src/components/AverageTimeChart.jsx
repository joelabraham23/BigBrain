import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

// Chart that displays the average time taken per Question given the data
const AverageTimeChart = ({ data }) => {
  const chartContainer = useRef(null);

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      const chartConfig = {
        type: 'bar',
        data: {
          labels: data.map((item, index) => `Question ${index + 1}`),
          datasets: [
            {
              label: 'Average Time (seconds)',
              data,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 0.5,
                callback: value => `${value}s`,
                suggestedMax: Math.max(...data) + 10,
                suggestedMin: 0,
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
      <h2>Average Time per Question</h2>
      <canvas ref={chartContainer}></canvas>
    </div>
  );
};

export default AverageTimeChart;

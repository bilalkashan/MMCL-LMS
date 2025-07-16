import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import styles from './EmployeeProgressGraph.module.css';

// Register required elements for Pie chart
Chart.register(ArcElement, Tooltip, Legend);

const EmployeeProgressGraph = ({ completed, inProgress, incomplete }) => {
  const data = {
    labels: ['Completed', 'In Progress', 'Incomplete'],
    datasets: [
      {
        data: [completed, inProgress, incomplete],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
        borderColor: ['#388e3c', '#f57c00', '#d32f2f'],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#333',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#333',
        bodyColor: '#333',
        borderColor: '#4caf50',
        borderWidth: 1,
      },
    },
  };

  return (
    <div className={styles.graphContainer}>
      <h3 className={styles.graphTitle}>Course Progress</h3>
      <Doughnut  data={data} options={options} />
    </div>
  );
};

export default EmployeeProgressGraph;
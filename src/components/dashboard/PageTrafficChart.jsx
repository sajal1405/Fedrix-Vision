// src/components/dashboard/PageTrafficChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';

const PageTrafficChart = ({ className }) => {
  const data = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        label: 'Website Visits',
        data: [65, 59, 80, 81, 56, 55, 40, 70, 75, 85, 90, 95],
        fill: true,
        backgroundColor: 'rgba(6, 182, 212, 0.25)', // Stronger fill
        borderColor: '#06B6D4', // Teal-500
        tension: 0.4,
        pointBackgroundColor: '#06B6D4',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#06B6D4',
        borderWidth: 3, // Thicker line
        pointRadius: 5, // Slightly larger points
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#E0E0E0',
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(40, 44, 52, 0.9)', // Darker, less transparent
        titleColor: '#06B6D4',
        bodyColor: '#E0E0E0',
        borderColor: '#06B6D4',
        borderWidth: 1,
        cornerRadius: 6, // More rounded tooltips
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.15)', // More visible grid lines
          drawBorder: false,
        },
        ticks: {
          color: '#B0B0B0',
        },
        title: {
          display: true,
          text: 'Month',
          color: '#E0E0E0',
          font: {
            size: 14,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.15)',
          drawBorder: false,
        },
        ticks: {
          color: '#B0B0B0',
          callback: function (value) {
            return value + 'k';
          },
        },
        title: {
          display: true,
          text: 'Visitors',
          color: '#E0E0E0',
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div
      className={`hologram-tile p-6 flex flex-col ${className || ''}
                    bg-gradient-to-br from-dark-gray/60 to-black-ops/60`}
    >
      <h3 className="text-lg font-semibold text-white/80 mb-4 pb-2 border-b border-teal-600/30">
        Page Traffic
      </h3>
      <div className="flex-grow">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

PageTrafficChart.propTypes = {
  className: PropTypes.string,
};

export default PageTrafficChart;

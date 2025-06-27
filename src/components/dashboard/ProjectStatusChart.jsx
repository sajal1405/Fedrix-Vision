// src/components/dashboard/ProjectStatusChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';

const ProjectStatusChart = ({ className }) => {
  const data = {
    labels: [
      'Discovery',
      'Planning',
      'Development',
      'Testing',
      'Deployment',
      'Completed',
    ],
    datasets: [
      {
        label: 'Projects',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(234, 179, 8, 0.7)', // yellow-500
          'rgba(249, 115, 22, 0.7)', // orange-500
          'rgba(6, 182, 212, 0.7)', // teal-500
          'rgba(139, 92, 246, 0.7)', // violet-500
          'rgba(239, 68, 68, 0.7)', // red-500
          'rgba(20, 184, 166, 0.7)', // emerald-500
        ],
        borderColor: [
          '#EAB308',
          '#F97316',
          '#06B6D4',
          '#8B5CF6',
          '#EF4444',
          '#14B8A6',
        ],
        borderWidth: 2, // Slightly thicker borders
        borderRadius: 8, // More rounded corners for bars
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(40, 44, 52, 0.9)',
        titleColor: '#06B6D4',
        bodyColor: '#E0E0E0',
        borderColor: '#06B6D4',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.15)',
          drawBorder: false,
        },
        ticks: {
          color: '#B0B0B0',
        },
        title: {
          display: true,
          text: 'Project Stage',
          color: '#E0E0E0',
          font: {
            size: 14,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.15)',
          drawBorder: false,
        },
        ticks: {
          color: '#B0B0B0',
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'Number of Projects',
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
      <h3 className="text-lg font-semibold text-white/80 mb-4 pb-2 border-b border-indigo-600/30">
        Project Status
      </h3>
      <div className="flex-grow">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

ProjectStatusChart.propTypes = {
  className: PropTypes.string,
};

export default ProjectStatusChart;

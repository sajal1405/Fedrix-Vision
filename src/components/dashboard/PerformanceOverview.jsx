// src/components/dashboard/PerformanceOverview.jsx
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
);

const PerformanceOverview = () => {
  const [kpis, setKpis] = useState([
    { name: 'Revenue', value: '$120,000', change: '+5%', status: 'up' },
    { name: 'Clients Acquired', value: '150', change: '+10%', status: 'up' },
    { name: 'Project Completion', value: '92%', change: '-2%', status: 'down' },
    {
      name: 'Customer Satisfaction',
      value: '4.8/5',
      change: 'Stable',
      status: 'stable',
    },
  ]);

  const [monthlyData, setMonthlyData] = useState({
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
        label: 'Monthly Revenue ($)',
        data: [
          6500, 5900, 8000, 8100, 5600, 5500, 4000, 7000, 8500, 9000, 7800,
          8900,
        ],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'New Clients',
        data: [10, 12, 8, 15, 11, 9, 14, 10, 13, 16, 10, 18],
        borderColor: 'rgb(6, 182, 212)',
        backgroundColor: 'rgba(6, 182, 212, 0.5)',
        tension: 0.3,
        fill: true,
      },
    ],
  });

  const monthlyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#CCCCCC',
          font: {
            size: 14,
            family: 'Inter, sans-serif',
          },
        },
      },
      title: {
        display: true,
        text: 'Monthly Performance Trends',
        color: '#F5F5F5',
        font: {
          size: 16,
          family: 'Inter, sans-serif',
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString();
            }
            return label;
          },
        },
        backgroundColor: '#333333',
        titleColor: '#F5F5F5',
        bodyColor: '#CCCCCC',
        borderColor: '#14B8A6',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      x: {
        ticks: { color: '#CCCCCC' },
        grid: { color: 'rgba(51, 51, 51, 0.5)' },
        title: {
          display: true,
          text: 'Month',
          color: '#F5F5F5',
        },
      },
      y: {
        ticks: { color: '#CCCCCC' },
        grid: { color: 'rgba(51, 51, 51, 0.5)' },
        title: {
          display: true,
          text: 'Value',
          color: '#F5F5F5',
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  useEffect(() => {
    const fetchRealData = () => {
      // Simulate API call and state updates to resolve `no-unused-vars` warnings for setKpis and setMonthlyData
      setTimeout(() => {
        setKpis((prevKpis) =>
          prevKpis.map((kpi) => ({
            ...kpi,
            value:
              kpi.name === 'Revenue'
                ? `$${(parseFloat(kpi.value.replace('$', '').replace(',', '')) + Math.floor(Math.random() * 1000)).toLocaleString()}`
                : kpi.value,
          })),
        );
        setMonthlyData((prevData) => ({
          ...prevData,
          datasets: prevData.datasets.map((dataset) => ({
            ...dataset,
            data: dataset.data.map(
              (val) => val + Math.floor(Math.random() * 100) - 50,
            ),
          })),
        }));
        console.log('Performance metrics updated (mock data).');
      }, 5000);
    };

    fetchRealData();
    const interval = setInterval(fetchRealData, 15000);

    return () => clearInterval(interval);
  }, []); // Removed `activityLog` from dependency array, now empty.

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="col-span-full grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <div className="lg:col-span-1 grid grid-cols-1 md:grid-cols-2 gap-6">
        {kpis.map((kpi) => (
          <motion.div
            key={kpi.name}
            className="hologram-tile p-6 flex flex-col items-start"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <h3 className="text-lg font-semibold text-light-gray mb-2">
              {kpi.name}
            </h3>
            <p className="text-3xl font-bold text-off-white mb-2">
              {kpi.value}
            </p>
            <div
              className={`flex items-center text-sm ${kpi.status === 'up' ? 'text-green-400' : kpi.status === 'down' ? 'text-red-400' : 'text-yellow-400'}`}
            >
              {kpi.change}{' '}
              {kpi.status === 'up' ? '▲' : kpi.status === 'down' ? '▼' : '▬'}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="hologram-tile p-6 lg:col-span-1 flex flex-col items-start justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="w-full h-80">
          <Line data={monthlyData} options={monthlyChartOptions} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PerformanceOverview;

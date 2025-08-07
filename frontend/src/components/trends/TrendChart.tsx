import React from 'react';
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
} from 'chart.js';
import type { GoogleTrendPoint } from '../../api/trendService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Props {
  data: GoogleTrendPoint[];
  topic: string;
}

export const TrendChart: React.FC<Props> = ({ data, topic }) => {
  const chartData = {
    labels: data.map(point => point.date),
    datasets: [
      {
        label: `Interest for "${topic}"`,
        data: data.map(point => point.value),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Google Trends: Interest Over Last 3 Months',
      },
    },
  };

  return <Line options={options} data={chartData} />;
};
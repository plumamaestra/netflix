// src/components/Reportes/ReportChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const ReportChart = ({ pagos }) => {
  const pagados = pagos.filter((p) => p.estado === 'Pagado').length;
  const pendientes = pagos.filter((p) => p.estado === 'Pendiente').length;

  const data = {
    labels: ['Pagados', 'Pendientes'],
    datasets: [
      {
        label: 'Pagos',
        data: [pagados, pendientes],
        backgroundColor: ['#22c55e', '#ef4444'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Resumen de Pagos</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ReportChart;

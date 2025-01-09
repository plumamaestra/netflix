import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const ReportChart = ({ pagos }) => {
  const data = {
    labels: ['Pagados', 'Pendientes'],
    datasets: [
      {
        label: 'Pagos',
        data: [
          pagos.filter((p) => p.estado === 'Pagado').length,
          pagos.filter((p) => p.estado === 'Pendiente').length,
        ],
        backgroundColor: ['#22c55e', '#ef4444'],
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Resumen de Pagos</h3>
      <Bar data={data} />
    </div>
  );
};

export default ReportChart;

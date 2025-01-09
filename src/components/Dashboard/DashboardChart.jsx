// src/components/Dashboard/DashboardChart.jsx
import React from 'react';

const DashboardChart = ({ pagos }) => {
  // Aquí puedes mapear tus pagos y mostrar un gráfico real.
  // Ejemplo: un contenedor con texto de "Aquí va el Chart".
  return (
    <div className="bg-gray-100 h-32 rounded flex items-center justify-center text-gray-500">
      [Aquí va el gráfico con {pagos.length} pagos]
    </div>
  );
};

export default DashboardChart;

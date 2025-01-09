import React from 'react';

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Clientes Totales</h3>
        <p className="text-2xl font-bold">{stats.totalClientes}</p>
      </div>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Pagos Realizados</h3>
        <p className="text-2xl font-bold text-green-500">{stats.pagosRealizados}</p>
      </div>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Servicios Activos</h3>
        <p className="text-2xl font-bold text-blue-500">{stats.totalServicios}</p>
      </div>
    </div>
  );
};

export default DashboardStats;

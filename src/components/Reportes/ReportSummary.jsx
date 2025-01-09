import React from 'react';

const ReportSummary = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Clientes Totales</h3>
        <p className="text-2xl font-bold">{summary.totalClientes}</p>
      </div>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Pagos Completados</h3>
        <p className="text-2xl font-bold text-green-500">{summary.pagosCompletados}</p>
      </div>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Pagos Pendientes</h3>
        <p className="text-2xl font-bold text-red-500">{summary.pagosPendientes}</p>
      </div>
    </div>
  );
};

export default ReportSummary;

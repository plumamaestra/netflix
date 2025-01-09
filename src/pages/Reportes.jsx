import React, { useState, useEffect } from 'react';
import { ReporteService } from '../services/Reporte.service';
import ReportSummary from '../components/Reportes/ReportSummary';
import ReportChart from '../components/Reportes/ReportChart';
import ReportTable from '../components/Reportes/ReportTable';

const Reportes = () => {
  const [summary, setSummary] = useState({});
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    setSummary(ReporteService.getSummary());
    setPayments(ReporteService.getPaymentsReport());
  }, []);

  const handleExport = () => {
    ReporteService.exportReportToCSV(payments, 'reporte_pagos');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">📊 Reportes</h1>
      <ReportSummary summary={summary} />
      <ReportChart pagos={payments} />
      <button onClick={handleExport} className="bg-blue-500 text-white px-4 py-2 rounded-md my-4">
        Exportar CSV
      </button>
      <ReportTable pagos={payments} />
    </div>
  );
};

export default Reportes;

// src/pages/Reportes.jsx
import React, { useState, useEffect } from 'react';
import { ReporteService } from '../services/Reporte.service';
import ReportSummary from '../components/Reportes/ReportSummary';
import ReportChart from '../components/Reportes/ReportChart';
import ReportTable from '../components/Reportes/ReportTable';

const Reportes = () => {
  const [summary, setSummary] = useState({});
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [summaryData, paymentsData] = await Promise.all([
          ReporteService.getSummary(),
          ReporteService.getPaymentsReport(),
        ]);
        setSummary(summaryData);
        setPayments(paymentsData);
      } catch (err) {
        setError('Hubo un error al cargar los reportes. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const handleExport = () => {
    ReporteService.exportReportToCSV(payments, 'reporte_pagos');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {loading ? (
        <p className="text-center text-gray-500">Cargando reportes...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <ReportSummary summary={summary} />
          <ReportChart pagos={payments} />
          <button
            onClick={handleExport}
            className="bg-blue-500 text-white px-4 py-2 rounded-md my-4 hover:bg-blue-600 transition-colors"
          >
            Exportar CSV
          </button>
          <ReportTable pagos={payments} />
        </>
      )}
    </div>
  );
};

export default Reportes;

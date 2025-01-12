// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Importa tu servicio DashboardService
import { DashboardService } from '../services/Dashboard.service';

// Card Reutilizable
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

const Dashboard = () => {
  // -------------------------------------------------
  // 1. Estados para tu dashboard, mes y año separados
  // -------------------------------------------------
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const [stats, setStats] = useState({
    ingresosTotales: 0,
    distribucionServicios: {},
  });
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [clientsStatus, setClientsStatus] = useState({ active: 0, inactive: 0 });
  const [paymentsSummary, setPaymentsSummary] = useState({
    totalPayments: 0,
    paidClients: 0,
    pendingPayments: 0,
  });
  const [morosoClients, setMorosoClients] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  // ---------------------------------------
  // 2. Funciones para cambiar de mes / año
  // ---------------------------------------
  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prevYear) => prevYear - 1);
    } else {
      setSelectedMonth((prevMonth) => prevMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prevYear) => prevYear + 1);
    } else {
      setSelectedMonth((prevMonth) => prevMonth + 1);
    }
  };

  // ---------------------------------------
  // 3. useEffect para cargar y filtrar los datos
  // ---------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Obtener estadísticas del Dashboard
        const dashboardStats = await DashboardService.getDashboardStats(selectedMonth, selectedYear);
        setStats({
          ingresosTotales: dashboardStats.ingresosTotales,
          distribucionServicios: dashboardStats.distribucionServicios,
        });
        setClientsStatus({
          active: dashboardStats.clientesActivos,
          inactive: dashboardStats.clientesInactivos,
        });
        setPaymentsSummary({
          totalPayments: dashboardStats.totalPagos,
          paidClients: dashboardStats.pagosRealizados,
          pendingPayments: dashboardStats.pagosPendientes,
        });

        // Obtener próximos pagos
        const upcoming = await DashboardService.getUpcomingPayments(selectedMonth, selectedYear);
        setUpcomingPayments(upcoming);

        // Obtener clientes morosos
        const morosos = await DashboardService.getMorosoClients();
        setMorosoClients(morosos);
      } catch (err) {
        console.error('Error al cargar los datos del Dashboard:', err);
        setError('Hubo un error al cargar los datos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  // ---------------
  // Helpers
  // ---------------
  const formatMoney = (num) => `RD$ ${num.toLocaleString('es-DO')}`;
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  // Lista de meses en español
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  // ---------------
  // Render del Dashboard
  // ---------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
            Panel de Control
          </h1>
          <p className="text-gray-500 mt-1">Gestión de clientes y pagos</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar cliente o servicio..."
            className="w-full md:w-96 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </header>

      {/* Month & Year Selector */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={handlePreviousMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <h2 className="text-xl font-semibold text-gray-800">
            {months[selectedMonth]} {selectedYear}
          </h2>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </Card>

      {loading ? (
        <p className="text-center text-gray-500">Cargando datos...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                  <TrendingUp className="text-white w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 font-medium">Ingresos Totales</p>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {formatMoney(stats.ingresosTotales || 0)}
                  </h2>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl">
                  <Users className="text-white w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 font-medium">Clientes Activos</p>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {clientsStatus.active}
                  </h2>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 rounded-xl">
                  <Clock className="text-white w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 font-medium">Pagos Pendientes</p>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {paymentsSummary.pendingPayments}
                  </h2>
                </div>
              </div>
            </Card>
          </div>

          {/* Payment Summary & Morosos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Resumen de Pagos</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="ml-2 text-sm font-medium text-gray-600">
                      Pagos Realizados
                    </p>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">
                    {paymentsSummary.paidClients}
                  </h3>
                </div>
                <div className="bg-red-50 p-4 rounded-xl">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-red-600" />
                    <p className="ml-2 text-sm font-medium text-gray-600">
                      Pagos Pendientes
                    </p>
                  </div>
                  <h3 className="text-2xl font-bold text-red-600 mt-2">
                    {paymentsSummary.pendingPayments}
                  </h3>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Clientes Morosos</h2>
              <div className="space-y-4">
                {morosoClients.length > 0 ? (
                  morosoClients.map((client) => (
                    <div
                      key={client.id}
                      className="flex justify-between items-center p-3 bg-red-50 rounded-lg"
                    >
                      <span className="font-medium text-gray-800">{client.name}</span>
                      <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                        Moroso
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    No hay clientes morosos
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Próximos Pagos */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Próximos Pagos</h2>
            <div className="grid gap-4">
              {upcomingPayments.length > 0 ? (
                upcomingPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex justify-between items-center p-4 bg-blue-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="font-medium text-gray-800">
                        {payment.clienteNombre}
                      </span>
                    </div>
                    <span className="text-sm text-blue-600 font-medium">
                      {formatDate(payment.fechaPago)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No hay pagos próximos
                </p>
              )}
            </div>
          </Card>

          {/* Distribución de Servicios */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Distribución de Servicios</h2>
            <div className="space-y-6">
              {Object.entries(stats.distribucionServicios || {}).map(([servicio, count]) => (
                <div key={servicio}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">{servicio}</span>
                    <span className="text-blue-600 font-medium">
                      {count} {count === 1 ? 'pago' : 'pagos'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                      style={{
                        width:
                          paymentsSummary.paidClients > 0
                            ? `${(count / paymentsSummary.paidClients) * 100}%`
                            : '0%',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;

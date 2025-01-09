// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { DashboardService } from '../services/Dashboard.service';
// Opcionalmente, podrías importar tus componentes personalizados:
// import DashboardChart from '../components/Dashboard/DashboardChart';
// import UpcomingPayments from '../components/Dashboard/UpcomingPayments';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    // Cargar estadísticas
    const data = DashboardService.getDashboardStats();
    setStats(data);

    // Cargar próximos pagos
    const ups = DashboardService.getUpcomingPayments();
    setUpcoming(ups);
  }, []);

  // Función para formatear dinero (opcional)
  const formatMoney = (num = 0) => num.toLocaleString('es-DO');

  const {
    ingresosTotales = 0,
    cuentasRenovadas = 0,
    clientesActivos = 0,
    clientesInactivos = 0,
    pagosPendientes = 0,
    pagosRealizados = 0,
    distribucionServicios = {},
  } = stats;

  // Convertir obj { Netflix: 2, HBO: 1 } en array [["Netflix", 2], ["HBO", 1]]
  const distServicioArr = Object.entries(distribucionServicios);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar superior */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <div className="flex items-center space-x-4">
          <div className="text-lg font-semibold">Streaming Admin</div>
        </div>
        <div className="flex-1 mx-8 hidden md:block">
          <input
            type="text"
            placeholder="Busca cualquier cuenta o cliente..."
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm">
            Agregar nueva cuenta
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Maneja tus cuentas de streaming con cuidado y precisión.
          </p>
        </div>

        {/* Rango de fechas (hardcodeado como ejemplo) */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Enero 2025 - Mayo 2025</span>
          </div>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Columna izquierda (8) */}
          <div className="xl:col-span-8 flex flex-col space-y-6">
            {/* Fila de tarjetas: Update / Ingresos Totales / Cuentas Renovadas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tarjeta “Update” */}
              <div className="bg-green-900 text-white p-4 rounded-md flex flex-col justify-between">
                <div className="text-xs uppercase mb-2 font-semibold">
                  Update
                </div>
                <div className="text-xs mb-2">Feb 12th 2025</div>
                <h2 className="text-lg font-bold mb-2">
                  ¡Aumento de 40% en alquileres de cuentas!
                </h2>
                <button className="bg-white text-green-900 text-sm py-1 px-3 rounded-md self-start">
                  Ver Detalles
                </button>
              </div>

              {/* Tarjeta Ingresos Totales */}
              <div className="bg-white rounded-md p-4 shadow-sm">
                <div className="text-gray-500 text-sm">Ingresos Totales</div>
                <div className="text-2xl font-bold mt-1">
                  RD$ {formatMoney(ingresosTotales)}
                </div>
                <div className="text-green-600 text-sm mt-1">
                  +35% respecto al mes pasado
                </div>
              </div>

              {/* Tarjeta Cuentas Renovadas */}
              <div className="bg-white rounded-md p-4 shadow-sm">
                <div className="text-gray-500 text-sm">Cuentas Renovadas</div>
                <div className="text-2xl font-bold mt-1">{cuentasRenovadas}</div>
                <div className="text-red-600 text-sm mt-1">
                  -24% respecto al mes pasado
                </div>
              </div>
            </div>

            {/* Sección: Próximos pagos + Ingresos Mensuales + Distribución servicios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Próximos pagos */}
              <div className="bg-white rounded-md p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Próximos Pagos</h3>
                </div>
                {upcoming.length > 0 ? (
                  <ul className="space-y-3">
                    {upcoming.map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-700">
                            {p.clienteNombre} - {p.servicio}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(p.fechaPago).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-xs text-yellow-600">
                          {p.estado}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No hay pagos pendientes</p>
                )}
              </div>

              {/* Ingresos Mensuales + Reporte de Servicios */}
              <div className="flex flex-col space-y-6">
                {/* Ingresos Mensuales (ejemplo de gráfico simulado) */}
                <div className="bg-white rounded-md p-4 shadow-sm flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-md font-bold">Ingresos Mensuales</h3>
                    <div className="text-sm text-gray-500">
                      <span className="mr-2">Mes actual</span> |{' '}
                      <span className="ml-2">Mes anterior</span>
                    </div>
                  </div>
                  <div className="text-gray-700 text-xl font-semibold mb-2">
                    RD$ {formatMoney(ingresosTotales)}
                    <span className="text-green-600 text-base ml-2">+35%</span>
                  </div>
                  {/* Simulación de un gráfico */}
                  <div className="h-24 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                    [ Gráfico de barras ]
                  </div>
                </div>

                {/* Reporte de servicios (barras horizontales) */}
                <div className="bg-white rounded-md p-4 shadow-sm flex-1">
                  <h3 className="text-md font-bold mb-2">Servicios Alquilados</h3>
                  <p className="text-xs text-gray-500 mb-2">
                    Distribución por servicio (Pagados)
                  </p>
                  {distServicioArr.length === 0 && (
                    <p className="text-sm text-gray-500">No hay pagos realizados</p>
                  )}
                  {distServicioArr.map(([servName, count]) => {
                    // Para calcular el porcentaje de cada servicio
                    const total = pagosRealizados || 1;
                    const pct = (count / total) * 100;

                    return (
                      <div key={servName} className="mb-3">
                        <div className="flex justify-between text-sm">
                          <span>
                            {servName} ({count})
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded mt-1">
                          <div
                            className="bg-green-500 h-2 rounded"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha (4) */}
          <div className="xl:col-span-4 flex flex-col space-y-6">
            {/* Rendimiento General (Donut) */}
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="text-md font-bold mb-2">Rendimiento General</h3>
              <div className="flex items-center justify-center py-4">
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <path
                      className="text-green-200"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-green-600"
                      strokeDasharray="23, 100"
                      strokeDashoffset="25"
                      strokeWidth="4"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold">
                    {clientesActivos}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 text-center">
                Total de clientes activos: {clientesActivos}
              </p>
              <div className="flex justify-center mt-3">
                <button className="text-xs text-green-600 border border-green-600 rounded px-2 py-1">
                  Ver más
                </button>
              </div>
              <div className="flex justify-around items-center mt-4 text-xs">
                <span className="text-gray-600">Activos</span>
                <span className="text-gray-600">
                  Inactivos: {clientesInactivos}
                </span>
              </div>
            </div>

            {/* CTA / Banner */}
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="text-md font-bold mb-2">
                Mejora tu gestión de cuentas ahora.
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                La forma más fácil de manejar tus servicios de streaming con cuidado y precisión.
              </p>
              <button className="bg-green-100 text-green-700 px-3 py-2 rounded-md text-sm font-medium">
                Actualiza tu Plan
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

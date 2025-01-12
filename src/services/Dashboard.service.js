// src/services/Dashboard.service.js
import { ClienteService } from './Cliente.service';
import { PagoService } from './Pago.service';
import { ServicioService } from './Servicio.service';

/**
 * DashboardService maneja la lógica de negocio para el Dashboard,
 * centralizando las llamadas a los servicios de clientes, pagos y servicios.
 */
export const DashboardService = {
  /**
   * Obtener estadísticas generales del Dashboard.
   * @param {number} selectedMonth - Mes seleccionado (0-11).
   * @param {number} selectedYear - Año seleccionado.
   * @returns {object} Estadísticas del Dashboard.
   */
  getDashboardStats: async (selectedMonth, selectedYear) => {
    try {
      const [clientes, pagos, servicios] = await Promise.all([
        ClienteService.getClients(),
        PagoService.getPayments(),
        ServicioService.getServices(),
      ]);

      // Filtrar los pagos que coincidan con selectedMonth y selectedYear
      const monthlyPayments = pagos.filter((payment) => {
        const pagoDate = new Date(payment.fechaPago);
        return (
          pagoDate.getFullYear() === selectedYear &&
          pagoDate.getMonth() === selectedMonth
        );
      });

      // Dividirlos en pagos pagados y pendientes
      const paidPayments = monthlyPayments.filter((p) => p.estado === 'Pagado');
      const pendingPayments = monthlyPayments.filter((p) => p.estado === 'Pendiente');

      // Calcular ingresos totales (solo de este mes y año)
      const ingresosTotales = paidPayments.reduce((acc, p) => acc + (p.monto || 0), 0);

      // Distribución de servicios (solo de los pagos pagados)
      const distribucionServicios = {};
      paidPayments.forEach((pago) => {
        const servicio = pago.servicio || 'Desconocido';
        if (!distribucionServicios[servicio]) {
          distribucionServicios[servicio] = 0;
        }
        distribucionServicios[servicio]++;
      });

      // Clientes Activos e Inactivos (por estado)
      const activeClients = clientes.filter((c) => c.estado === 'Activo');
      const inactiveClients = clientes.filter((c) => c.estado === 'Inactivo');

      // Resumen de pagos (totales, pagados, pendientes)
      return {
        ingresosTotales,
        distribucionServicios,
        totalPagos: monthlyPayments.length,
        pagosRealizados: paidPayments.length,
        pagosPendientes: pendingPayments.length,
        clientesActivos: activeClients.length,
        clientesInactivos: inactiveClients.length,
      };
    } catch (error) {
      console.error('Error en getDashboardStats:', error);
      throw error;
    }
  },

  /**
   * Obtener los próximos pagos pendientes.
   * @param {number} selectedMonth - Mes seleccionado (0-11).
   * @param {number} selectedYear - Año seleccionado.
   * @returns {Array} Lista de próximos pagos.
   */
  getUpcomingPayments: async (selectedMonth, selectedYear) => {
    try {
      const pagos = await PagoService.getPayments();

      // Filtrar los pagos que coincidan con selectedMonth y selectedYear y estén pendientes
      const monthlyPendingPayments = pagos.filter((payment) => {
        const pagoDate = new Date(payment.fechaPago);
        return (
          pagoDate.getFullYear() === selectedYear &&
          pagoDate.getMonth() === selectedMonth &&
          payment.estado === 'Pendiente'
        );
      });

      // Ordenar por fecha y limitar a los primeros 5
      const upcoming = monthlyPendingPayments
        .sort((a, b) => new Date(a.fechaPago) - new Date(b.fechaPago))
        .slice(0, 5);

      return upcoming;
    } catch (error) {
      console.error('Error en getUpcomingPayments:', error);
      throw error;
    }
  },

  /**
   * Obtener la lista de clientes morosos (con 2 o más pagos pendientes).
   * @returns {Array} Lista de clientes morosos.
   */
  getMorosoClients: async () => {
    try {
      const clientes = await ClienteService.getClients();
      const pagos = await PagoService.getPayments();

      // Filtrar clientes que tengan 2 o más pagos pendientes
      const morosos = clientes.filter((cliente) => {
        const pagosPendientesCliente = pagos.filter(
          (pago) => pago.clienteId === cliente.id && pago.estado === 'Pendiente'
        );
        return pagosPendientesCliente.length >= 2;
      });

      return morosos;
    } catch (error) {
      console.error('Error en getMorosoClients:', error);
      throw error;
    }
  },
};

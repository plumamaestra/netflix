// src/services/Dashboard.service.js
import { ClienteService } from './Cliente.service';
import { PagoService } from './Pago.service';
import { ServicioService } from './Servicio.service';

export const DashboardService = {
  getDashboardStats: () => {
    const clientes = ClienteService.getClients();
    const pagos = PagoService.getPayments();
    const servicios = ServicioService.getServices();

    // Filtrar pagos “Pagados”
    const pagosRealizados = pagos.filter((p) => p.estado === 'Pagado');

    // Sumar montos de todos los pagos "Pagados" para obtener ingresos
    const ingresosTotales = pagosRealizados.reduce(
      (acc, p) => acc + (p.monto || 0),
      0
    );

    // Consideramos como “cuentas renovadas” aquellas con numeroMeses > 1
    const cuentasRenovadas = pagosRealizados.filter(
      (p) => p.numeroMeses && p.numeroMeses > 1
    ).length;

    // Distribución de servicios (Netflix, HBO, etc.) basados en pagos "Pagados"
    const distribucionServicios = {};
    pagosRealizados.forEach((pago) => {
      const servicio = pago.servicio || 'Desconocido';
      if (!distribucionServicios[servicio]) {
        distribucionServicios[servicio] = 0;
      }
      distribucionServicios[servicio]++;
    });

    return {
      totalClientes: clientes.length,
      clientesActivos: clientes.filter((c) => c.estado === 'Activo').length,
      clientesInactivos: clientes.filter((c) => c.estado === 'Inactivo').length,
      totalPagos: pagos.length,
      pagosRealizados: pagosRealizados.length,
      pagosPendientes: pagos.filter((p) => p.estado === 'Pendiente').length,
      totalServicios: servicios.length,

      // Datos adicionales
      ingresosTotales,
      cuentasRenovadas,
      distribucionServicios,
    };
  },

  getUpcomingPayments: () => {
    const pagos = PagoService.getPayments();
    return pagos
      .filter((p) => p.estado === 'Pendiente')
      .sort((a, b) => new Date(a.fechaPago) - new Date(b.fechaPago))
      .slice(0, 5);
  },

  // Si quieres obtener todos los pagos (por ejemplo, para un historial completo)
  getAllPayments: () => {
    return PagoService.getPayments();
  },
};

// src/services/Reporte.service.js
import { ClienteService } from './Cliente.service';
import { PagoService } from './Pago.service';
import { ServicioService } from './Servicio.service';

/**
 * ReporteService maneja la lógica de negocio para los reportes,
 * centralizando las llamadas a los servicios de clientes, pagos y servicios.
 */
export const ReporteService = {
  /**
   * Obtener resumen de reportes.
   * @returns {object} Resumen de reportes.
   */
  getSummary: async () => {
    try {
      const [clientes, pagos, servicios] = await Promise.all([
        ClienteService.getClients(),
        PagoService.getPayments(),
        ServicioService.getServices(),
      ]);

      return {
        totalClientes: clientes.length,
        clientesActivos: clientes.filter((c) => c.estado === 'Activo').length,
        clientesInactivos: clientes.filter((c) => c.estado === 'Inactivo').length,
        totalPagos: pagos.length,
        pagosCompletados: pagos.filter((p) => p.estado === 'Pagado').length,
        pagosPendientes: pagos.filter((p) => p.estado === 'Pendiente').length,
        totalServicios: servicios.length,
      };
    } catch (error) {
      console.error('Error en getSummary:', error);
      throw error;
    }
  },

  /**
   * Obtener reporte de pagos.
   * @returns {Array} Lista de pagos.
   */
  getPaymentsReport: async () => {
    try {
      const pagos = await PagoService.getPayments();
      return pagos;
    } catch (error) {
      console.error('Error en getPaymentsReport:', error);
      throw error;
    }
  },

  /**
   * Exportar reporte a CSV.
   * @param {Array} data - Datos a exportar.
   * @param {string} filename - Nombre del archivo.
   */
  exportReportToCSV: (data, filename) => {
    if (!data || data.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    const csvRows = [];

    // Obtener encabezados
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    // Obtener filas
    data.forEach((row) => {
      const values = headers.map((header) => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};

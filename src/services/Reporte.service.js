import { ClienteService } from './Cliente.service';
import { PagoService } from './Pago.service';
import { ServicioService } from './Servicio.service';

export const ReporteService = {
  getSummary: () => {
    const clientes = ClienteService.getClients();
    const pagos = PagoService.getPayments();
    const servicios = ServicioService.getServices();

    return {
      totalClientes: clientes.length,
      clientesActivos: clientes.filter((c) => c.estado === 'Activo').length,
      clientesInactivos: clientes.filter((c) => c.estado === 'Inactivo').length,
      totalPagos: pagos.length,
      pagosCompletados: pagos.filter((p) => p.estado === 'Pagado').length,
      pagosPendientes: pagos.filter((p) => p.estado === 'Pendiente').length,
      totalServicios: servicios.length,
    };
  },

  getPaymentsReport: () => {
    return PagoService.getPayments();
  },

  exportReportToCSV: (data, filename) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      Object.keys(data[0]).join(',') +
      '\n' +
      data.map((row) => Object.values(row).join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};

import { ClienteService } from './Cliente.service';
import { ServicioService } from './Servicio.service';

const PAGOS_KEY = 'pagos';

export const PagoService = {
  /**
   * Obtener todos los pagos
   */
  getPayments: () => JSON.parse(localStorage.getItem(PAGOS_KEY)) || [],

  /**
   * Agregar un nuevo pago
   */
  addPayment: (payment) => {
    const payments = PagoService.getPayments();
    payment.id = Date.now().toString();
    payment.fechaCreacion = new Date().toISOString();
  
    // Asegurarnos de que venga el numeroMeses (por defecto 1)
    if (!payment.numeroMeses) {
      payment.numeroMeses = 1;
    }
  
    payments.push(payment);
    localStorage.setItem(PAGOS_KEY, JSON.stringify(payments));
  },
  

 /**
 * Actualizar un pago existente
 */
updatePayment: (id, updatedPayment) => {
  const payments = PagoService.getPayments().map((payment) =>
    payment.id === id ? { ...payment, ...updatedPayment } : payment
  );
  localStorage.setItem(PAGOS_KEY, JSON.stringify(payments));

  // Si el pago está marcado como "Pagado", actualizamos la próxima fecha de pago del cliente
  if (updatedPayment.estado === 'Pagado') {
    const cliente = ClienteService.getClients().find((client) => client.id === updatedPayment.clienteId);
    if (cliente) {
      // Podemos leer el número de meses pagados (si no existe, asumimos 1 mes).
      const numeroMeses = updatedPayment.numeroMeses ? parseInt(updatedPayment.numeroMeses, 10) : 1;

      // Movemos la fecha de próximaPago tantos meses como indique `numeroMeses`
      const proximaFecha = new Date(cliente.proximaFechaPago);
      proximaFecha.setMonth(proximaFecha.getMonth() + numeroMeses);

      // Actualizamos el cliente con la nueva fecha
      cliente.proximaFechaPago = proximaFecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD

      // Guardamos el cliente actualizado
      ClienteService.updateClient(cliente.id, cliente);
    }
  }
},

  /**
   * Eliminar un pago
   */
  deletePayment: (id) => {
    const payments = PagoService.getPayments().filter((payment) => payment.id !== id);
    localStorage.setItem(PAGOS_KEY, JSON.stringify(payments));
  },

  /**
   * Obtener pagos de un cliente
   */
  getPaymentsByClientId: (clienteId) => {
    return PagoService.getPayments().filter((payment) => payment.clienteId === clienteId);
  },

  generatePendingPayments: () => {
    console.log('⏳ Iniciando generación de pagos pendientes...');
    const clientes = ClienteService.getClients();
  
    clientes.forEach((cliente) => {
      if (!cliente.servicios || cliente.servicios.length === 0) {
        console.warn(`⚠️ Cliente ${cliente.name} no tiene un servicio asignado.`);
        return;
      }
  
      // Si el cliente tiene solo un servicio, convertir a array
      const servicioIds = Array.isArray(cliente.servicios) ? cliente.servicios : [cliente.servicios];
  
      servicioIds.forEach((servicioId) => {
        const servicio = ServicioService.getServiceById(servicioId);
  
        if (!servicio || !servicio.proximaFechaPago) {
          console.warn(`⚠️ El servicio del cliente ${cliente.name} no tiene una fecha válida.`);
          return;
        }
  
        const fechaPago = new Date(servicio.proximaFechaPago);
        const hoy = new Date();
        const diferencia = Math.floor((fechaPago - hoy) / (1000 * 60 * 60 * 24));
  
        console.log(`🗓️ Cliente: ${cliente.name}, Días para pagar: ${diferencia}`);
  
        // Si faltan 3 días o menos para la fecha de pago
        if (diferencia <= 3 && diferencia >= 0) {
          console.log(`🔔 Cliente: ${cliente.name} está dentro del rango de días para pago pendiente.`);
  
          const existingPayments = PagoService.getPaymentsByClientId(cliente.id);
          
          // Verificar si ya existe un pago completado para el cliente y servicio
          const pagoCompletado = existingPayments.some(
            (pago) => pago.fechaPago === servicio.proximaFechaPago && pago.estado === 'Pagado'
          );
  
          if (pagoCompletado) {
            console.log(`ℹ️ El cliente ${cliente.name} ya ha pagado la factura de ${servicio.name}. No se generará un pago pendiente.`);
            return; // No generar un pago pendiente si el pago está completado
          }
  
          // Verificar si ya existe un pago pendiente para este cliente y servicio
          const yaExistePagoPendiente = existingPayments.some(
            (pago) => pago.fechaPago === servicio.proximaFechaPago && pago.estado === 'Pendiente'
          );
  
          if (!yaExistePagoPendiente) {
            console.log(`✅ Generando pago pendiente para ${cliente.name}`);
  
            // Asegurándose de agregar el nombre del cliente y el monto del servicio correctamente
            PagoService.addPayment({
              clienteId: cliente.id,
              clienteNombre: cliente.name, // Nombre del cliente
              servicioId: servicio.id, // ID del servicio
              servicio: servicio.name,  // Nombre del servicio
              monto: parseFloat(servicio.price),  // Monto del servicio
              fechaPago: servicio.proximaFechaPago,
              estado: 'Pendiente',
            });
          } else {
            console.log(`ℹ️ Ya existe un pago pendiente para ${cliente.name}`);
          }
        }
      });
    });
  
    console.log('✅ Finalizó la generación de pagos pendientes.');
    PagoService.updateClientStatus();
  },
  
  /**
   * Actualizar el estado de los clientes basado en los pagos pendientes
   * - Si un cliente tiene 2 o más pagos pendientes, se marcará como 'Inactivo'
   */
  updateClientStatus: () => {
    console.log('⏳ Actualizando estado de los clientes...');
    const clientes = ClienteService.getClients();

    clientes.forEach((cliente) => {
      const pagosPendientes = PagoService.getPaymentsByClientId(cliente.id).filter(
        (pago) => pago.estado === 'Pendiente'
      );

      if (pagosPendientes.length >= 2) {
        console.warn(`⚠️ Cliente ${cliente.name} ha sido marcado como Inactivo por pagos pendientes.`);
        cliente.estado = 'Inactivo';
        ClienteService.updateClient(cliente.id, cliente);
      }
    });

    console.log('✅ Estados de clientes actualizados correctamente.');
  },
};

// Exponer PagoService en la consola para pruebas manuales
window.PagoService = PagoService;

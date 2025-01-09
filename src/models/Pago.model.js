// models/Pago.model.js
export const PagoModel = {
    id: null,              // Identificador único del pago
    clienteId: null,       // ID del cliente que realizó el pago
    servicioId: null,      // ID del servicio pagado
    monto: 0,              // Monto pagado
    fechaPago: '',         // Fecha del pago (ISO 8601)
    metodoPago: 'efectivo',// Método de pago: efectivo | tarjeta | transferencia
    estado: 'completado',  // Estado del pago: completado | pendiente
  };
  
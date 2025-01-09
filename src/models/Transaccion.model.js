// models/Transaccion.model.js
export const TransaccionModel = {
    id: null,               // Identificador único de la transacción
    tipo: 'pago',           // Tipo: pago | ajuste | reembolso
    clienteId: null,        // ID del cliente involucrado
    servicioId: null,       // ID del servicio involucrado (si aplica)
    fecha: '',             // Fecha de la transacción (ISO 8601)
    descripcion: '',        // Descripción de la transacción
    monto: 0,               // Monto asociado
  };
  
// models/Notificacion.model.js
export const NotificacionModel = {
    id: null,             // Identificador único de la notificación
    tipo: 'recordatorio', // Tipo: recordatorio | alerta | aviso
    clienteId: null,      // ID del cliente (si aplica)
    mensaje: '',          // Mensaje de la notificación
    leido: false,         // Estado de lectura: true | false
    fechaEnvio: '',       // Fecha de envío (ISO 8601)
  };
  
// models/Servicio.model.js
export const ServicioModel = {
  id: null,               // Identificador único del servicio
  nombre: '',             // Nombre del servicio (Netflix, Spotify, HBO)
  descripcion: '',        // Descripción breve (opcional)
  precioMensual: 0,       // Precio mensual del servicio
  proximaFechaPago: '',   // Próxima fecha de pago (ISO 8601)
  estado: 'disponible',   // Estado: disponible | no disponible
};

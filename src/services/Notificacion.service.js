// services/Notificacion.service.js
import { NotificacionModel } from '../models/Notificacion.model';

const NOTIFICACIONES_KEY = 'notificaciones';

export const NotificacionService = {
  obtenerNotificaciones: () => {
    return JSON.parse(localStorage.getItem(NOTIFICACIONES_KEY)) || [];
  },

  agregarNotificacion: (notificacion) => {
    const notificaciones = NotificacionService.obtenerNotificaciones();
    notificacion.id = Date.now();
    notificacion.fechaEnvio = new Date().toISOString();
    notificaciones.push({ ...NotificacionModel, ...notificacion });
    localStorage.setItem(NOTIFICACIONES_KEY, JSON.stringify(notificaciones));
    return notificacion;
  },

  marcarComoLeido: (id) => {
    let notificaciones = NotificacionService.obtenerNotificaciones();
    notificaciones = notificaciones.map((notificacion) =>
      notificacion.id === id ? { ...notificacion, leido: true } : notificacion
    );
    localStorage.setItem(NOTIFICACIONES_KEY, JSON.stringify(notificaciones));
  },
};

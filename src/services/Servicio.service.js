const SERVICIOS_KEY = 'servicios';

export const ServicioService = {
  // Obtener todos los servicios
  getServices: () => JSON.parse(localStorage.getItem(SERVICIOS_KEY)) || [],

  // Obtener servicio por ID
  getServiceById: (id) => ServicioService.getServices().find((service) => service.id === id),

  // Agregar servicio
  addService: (service) => {
    const services = ServicioService.getServices();
    service.id = Date.now().toString();
    service.fechaCreacion = new Date().toLocaleDateString();
    services.push(service);
    localStorage.setItem(SERVICIOS_KEY, JSON.stringify(services));
  },

  // Actualizar servicio
  updateService: (id, updatedService) => {
    const services = ServicioService.getServices().map((service) =>
      service.id === id ? { ...service, ...updatedService } : service
    );
    localStorage.setItem(SERVICIOS_KEY, JSON.stringify(services));
  },

  // Eliminar servicio
  deleteService: (id) => {
    const services = ServicioService.getServices().filter((service) => service.id !== id);
    localStorage.setItem(SERVICIOS_KEY, JSON.stringify(services));
  },
};

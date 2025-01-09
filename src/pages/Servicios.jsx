import React, { useState, useEffect } from 'react';
import { ServicioService } from '../services/Servicio.service';
import ServiciosTable from '../components/Servicios/ServiciosTable';
import AddServiceModal from '../components/Servicios/AddServiceModal';

const Servicios = () => {
  const [services, setServices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  /**
   * Cargar Servicios al inicio
   */
  useEffect(() => {
    setServices(ServicioService.getServices());
  }, []);

  /**
   * Guardar Servicio (Agregar/Editar)
   */
  const handleSave = (service) => {
    if (editingService) {
      ServicioService.updateService(service.id, service);
    } else {
      ServicioService.addService(service);
    }
    setServices(ServicioService.getServices());
    setModalOpen(false);
    setEditingService(null);
  };

  /**
   * Eliminar Servicio
   */
  const handleDelete = (id) => {
    ServicioService.deleteService(id);
    setServices(ServicioService.getServices());
  };

  /**
   * Abrir Modal para Agregar Servicio
   */
  const handleAddService = () => {
    setEditingService(null);
    setModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Encabezado */}
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">🛠️ Servicios</h1>
        <button
          onClick={handleAddService}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          + Agregar Servicio
        </button>
      </div>

      {/* Tabla de Servicios */}
      <ServiciosTable
        services={services}
        onEdit={(service) => {
          setEditingService(service);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      {/* Modal de Agregar/Editar Servicio */}
      <AddServiceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingService}
      />
    </div>
  );
};

export default Servicios;

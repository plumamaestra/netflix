// src/pages/Servicios.jsx
import React, { useState, useEffect } from 'react';
import { ServicioService } from '../services/Servicio.service';
import ServiciosTable from '../components/Servicios/ServiciosTable';
import AddServiceModal from '../components/Servicios/AddServiceModal';

const Servicios = () => {
  const [services, setServices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    setServices(ServicioService.getServices());
  }, []);

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

  const handleDelete = (id) => {
    ServicioService.deleteService(id);
    setServices(ServicioService.getServices());
  };

  const handleAddService = () => {
    setEditingService(null);
    setModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ServiciosTable
        services={services}
        onEdit={(service) => {
          setEditingService(service);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

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

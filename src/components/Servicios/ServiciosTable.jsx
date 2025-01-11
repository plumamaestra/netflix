// src/components/Servicios/ServiciosTable.jsx
import React, { useEffect, useState } from 'react';
import { ServicioService } from '../../services/Servicio.service';

const ServiciosTable = ({ onEdit, onDelete }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Cargar servicios al montar el componente
   */
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const servicios = await ServicioService.getServices();
        setServices(servicios);
      } catch (err) {
        console.error('Error al cargar los servicios:', err);
        setError('No se pudieron cargar los servicios.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  /**
   * Manejar la actualización de servicios cuando se agrega, edita o elimina uno
   */
  const refreshServices = async () => {
    setLoading(true);
    try {
      const servicios = await ServicioService.getServices();
      setServices(servicios);
      setError(null);
    } catch (err) {
      console.error('Error al recargar los servicios:', err);
      setError('No se pudieron recargar los servicios.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manejar la eliminación de un servicio
   */
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      try {
        await onDelete(id);
        await refreshServices();
      } catch (err) {
        console.error('Error al eliminar el servicio:', err);
        setError('No se pudo eliminar el servicio.');
      }
    }
  };

  /**
   * Manejar la edición de un servicio
   */
  const handleEdit = async (service) => {
    try {
      await onEdit(service);
      await refreshServices();
    } catch (err) {
      console.error('Error al editar el servicio:', err);
      setError('No se pudo editar el servicio.');
    }
  };

  if (loading) {
    return <p>Cargando servicios...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-4">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="bg-gray-100 text-gray-700 uppercase">
          <tr>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Precio Mensual</th>
            <th className="px-4 py-2">Descripción</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">Próxima Fecha de Pago</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {services.length > 0 ? (
            services.map((service) => (
              <tr key={service.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{service.nombre}</td>
                <td className="px-4 py-2">${service.precioMensual}</td>
                <td className="px-4 py-2">{service.descripcion || 'N/A'}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-md ${
                      service.estado === 'disponible'
                        ? 'bg-green-200 text-green-700'
                        : 'bg-red-200 text-red-700'
                    }`}
                  >
                    {service.estado}
                  </span>
                </td>
                <td className="px-4 py-2">{service.proximaFechaPago || 'N/A'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                No hay servicios disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServiciosTable;

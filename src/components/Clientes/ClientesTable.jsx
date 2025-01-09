import React, { useEffect, useState } from 'react';
import { ServicioService } from '../../services/Servicio.service';

const ClientesTable = ({ clients, onEdit, onDelete }) => {
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);

  /**
   * Cargar servicios disponibles al montar el componente
   */
  useEffect(() => {
    try {
      const servicios = ServicioService.getServices();
      setServiciosDisponibles(servicios);
    } catch (error) {
      console.error('Error al cargar los servicios:', error.message);
    }
  }, []);

  /**
   * Buscar el nombre del servicio por ID
   */
  const getServiceNameById = (id) => {
    if (!id) return 'Sin servicios';
    const servicio = serviciosDisponibles.find((service) => service.id === id);
    return servicio ? servicio.name || servicio.nombre : 'Servicio desconocido';
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-4">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="bg-gray-100 text-gray-700 uppercase">
          <tr>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Teléfono</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">Servicio</th>
            <th className="px-4 py-2">Próxima Fecha de Pago</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b hover:bg-gray-50">
              {/* Nombre del Cliente */}
              <td className="px-4 py-2">{client.name}</td>

              {/* Teléfono del Cliente */}
              <td className="px-4 py-2">{client.phone}</td>

              {/* Estado del Cliente */}
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-md ${
                    client.estado === 'Activo' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
                  }`}
                >
                  {client.estado}
                </span>
              </td>

              {/* Servicios del Cliente */}
              <td className="px-4 py-2">
                <span className="bg-blue-200 text-blue-700 px-2 py-1 rounded-md">
                  {getServiceNameById(client.servicios)}
                </span>
              </td>

              {/* Próxima Fecha de Pago */}
              <td className="px-4 py-2">{client.proximaFechaPago || 'N/A'}</td>

              {/* Acciones */}
              <td className="px-4 py-2">
                <button onClick={() => onEdit(client)} className="text-blue-500 mr-2">
                  Editar
                </button>
                <button onClick={() => onDelete(client.id)} className="text-red-500">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientesTable;

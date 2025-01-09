import React from 'react';

const ServiciosTable = ({ services, onEdit, onDelete }) => {
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
                <td className="px-4 py-2">{service.name}</td>
                <td className="px-4 py-2">${service.price}</td>
                <td className="px-4 py-2">{service.description || 'N/A'}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-md ${
                      service.estado === 'Activo' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
                    }`}
                  >
                    {service.estado}
                  </span>
                </td>
                <td className="px-4 py-2">{service.proximaFechaPago || 'N/A'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => onEdit(service)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(service.id)}
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

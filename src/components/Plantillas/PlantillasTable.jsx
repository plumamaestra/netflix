import React from 'react';

const PlantillasTable = ({ plantillas, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-4">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="bg-gray-100 text-gray-700 uppercase">
          <tr>
            <th className="px-4 py-2">Tipo</th>
            <th className="px-4 py-2">Contenido</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {plantillas.length > 0 ? (
            plantillas.map((plantilla) => (
              <tr key={plantilla.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{plantilla.tipo}</td>
                <td className="px-4 py-2">
                  {plantilla.contenido.length > 50
                    ? `${plantilla.contenido.slice(0, 50)}...`
                    : plantilla.contenido}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => onEdit(plantilla)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(plantilla.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                No hay plantillas disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PlantillasTable;

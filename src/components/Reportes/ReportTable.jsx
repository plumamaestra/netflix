// src/components/Reportes/ReportTable.jsx
import React from 'react';

const ReportTable = ({ pagos }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-4">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="bg-gray-100 text-gray-700 uppercase">
          <tr>
            <th className="px-4 py-2">Cliente</th>
            <th className="px-4 py-2">Servicio</th>
            <th className="px-4 py-2">Monto</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">Fecha de Pago</th>
          </tr>
        </thead>
        <tbody>
          {pagos.length > 0 ? (
            pagos.map((pago) => (
              <tr key={pago.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{pago.clienteNombre || 'N/A'}</td>
                <td className="px-4 py-2">{pago.servicio || 'N/A'}</td>
                <td className="px-4 py-2">{pago.monto ? `$${pago.monto}` : 'N/A'}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      pago.estado === 'Pagado'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {pago.estado || 'N/A'}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {pago.fechaPago
                    ? new Date(pago.fechaPago).toLocaleDateString('es-DO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No hay pagos disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;

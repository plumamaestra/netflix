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
          </tr>
        </thead>
        <tbody>
          {pagos.map((pago) => (
            <tr key={pago.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{pago.clienteNombre}</td>
              <td className="px-4 py-2">{pago.servicio}</td>
              <td className="px-4 py-2">${pago.monto}</td>
              <td className="px-4 py-2">{pago.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;

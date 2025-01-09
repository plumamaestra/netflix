// src/components/Dashboard/UpcomingPayments.jsx
import React from 'react';

const UpcomingPayments = ({ pagos }) => {
  if (!pagos || pagos.length === 0) {
    return <p className="text-sm text-gray-500">No hay pagos pendientes</p>;
  }

  return (
    <ul className="space-y-2">
      {pagos.map((pago) => (
        <li
          key={pago.id}
          className="flex items-center justify-between p-2 bg-gray-50 rounded shadow-sm text-sm"
        >
          <div>
            <p className="font-medium text-gray-700">
              {pago.clienteNombre} - {pago.servicio}
            </p>
            <p className="text-xs text-gray-500">
              Fecha: {new Date(pago.fechaPago).toLocaleDateString()}
            </p>
          </div>
          <span className="text-xs font-semibold text-yellow-700">
            {pago.estado}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default UpcomingPayments;

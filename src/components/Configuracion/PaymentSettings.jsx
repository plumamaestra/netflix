// src/components/Configuracion/PaymentSettings.jsx
import React, { useState, useEffect } from 'react';

const PaymentSettings = ({ settings, onSave }) => {
  const [paymentSettings, setPaymentSettings] = useState(settings.pagos || {});

  useEffect(() => {
    setPaymentSettings(settings.pagos || {});
  }, [settings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentSettings({
      ...paymentSettings,
      [name]: parseFloat(value) || 0, // Asegura que los valores sean numéricos
    });
  };

  const handleSave = () => {
    onSave({ ...settings, pagos: paymentSettings });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Configuración de Pagos</h2>
      <div className="grid gap-4">
        <div>
          <label className="block text-gray-600 mb-1">Impuesto (%)</label>
          <input
            type="number"
            name="impuesto"
            value={paymentSettings.impuesto || 0}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Recargo por Retraso (%)</label>
          <input
            type="number"
            name="recargoRetraso"
            value={paymentSettings.recargoRetraso || 0}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            min="0"
            step="0.01"
          />
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600 transition-colors"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default PaymentSettings;

// src/components/Configuracion/NotificationSettings.jsx
import React, { useState, useEffect } from 'react';

const NotificationSettings = ({ settings, onSave }) => {
  const [notificationSettings, setNotificationSettings] = useState(settings.notificaciones || {});

  useEffect(() => {
    setNotificationSettings(settings.notificaciones || {});
  }, [settings]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSave = () => {
    onSave({ ...settings, notificaciones: notificationSettings });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Configuración de Notificaciones</h2>
      <div className="grid gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="habilitarRecordatorios"
            checked={notificationSettings.habilitarRecordatorios || false}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="habilitarRecordatorios" className="ml-2 block text-gray-700">
            Habilitar Recordatorios de Pago
          </label>
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Método de Envío</label>
          <select
            name="metodoEnvio"
            value={notificationSettings.metodoEnvio || 'WhatsApp'}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="WhatsApp">WhatsApp</option>
            <option value="Email">Email</option>
            <option value="SMS">SMS</option>
          </select>
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

export default NotificationSettings;

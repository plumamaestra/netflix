// src/components/Configuracion/GeneralSettings.jsx
import React, { useState, useEffect } from 'react';

const GeneralSettings = ({ settings, onSave }) => {
  const [generalSettings, setGeneralSettings] = useState(settings.general || {});

  useEffect(() => {
    setGeneralSettings(settings.general || {});
  }, [settings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings({ ...generalSettings, [name]: value });
  };

  const handleSave = () => {
    onSave({ ...settings, general: generalSettings });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Configuración General</h2>
      <div className="grid gap-4">
        <div>
          <label className="block text-gray-600 mb-1">Nombre del Sistema</label>
          <input
            type="text"
            name="nombreSistema"
            value={generalSettings.nombreSistema || ''}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Moneda Predeterminada</label>
          <select
            name="moneda"
            value={generalSettings.moneda || 'USD'}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="USD">USD</option>
            <option value="RD$">RD$</option>
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

export default GeneralSettings;

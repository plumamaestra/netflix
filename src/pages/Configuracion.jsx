// src/pages/Configuracion.jsx
import React, { useState, useEffect } from 'react';
import { ConfiguracionService } from '../services/Configuracion.service';

// 1. Componente principal
function ConfiguracionPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sección activa
  const [activeSection, setActiveSection] = useState('general');

  // Cargar config al montar
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const config = await ConfiguracionService.getSettings();
        setSettings(config);
      } catch (err) {
        setError('Hubo un problema al cargar la configuración.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Manejar guardado en Firestore
  const handleSave = async (updatedSettings) => {
    try {
      await ConfiguracionService.updateSettings(updatedSettings);
      setSettings(updatedSettings);
      alert('Configuración actualizada con éxito.');
    } catch (err) {
      alert('Error al guardar la configuración.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando configuración...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Configuraciones de RentaPlay</h1>

      {/* Menú para cambiar de sección */}
      <div className="flex border-b mb-4 space-x-6">
        <button
          onClick={() => setActiveSection('general')}
          className={`pb-2 ${
            activeSection === 'general'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveSection('payment')}
          className={`pb-2 ${
            activeSection === 'payment'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          Pagos
        </button>
        <button
          onClick={() => setActiveSection('notifications')}
          className={`pb-2 ${
            activeSection === 'notifications'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          Notificaciones
        </button>
        <button
          onClick={() => setActiveSection('integrations')}
          className={`pb-2 ${
            activeSection === 'integrations'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          Integraciones
        </button>
        <button
          onClick={() => setActiveSection('advanced')}
          className={`pb-2 ${
            activeSection === 'advanced'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          Avanzado
        </button>
      </div>

      {/* Render condicional de los subcomponentes */}
      {activeSection === 'general' && (
        <GeneralSettings settings={settings} onSave={handleSave} />
      )}
      {activeSection === 'payment' && (
        <PaymentSettings settings={settings} onSave={handleSave} />
      )}
      {activeSection === 'notifications' && (
        <NotificationSettings settings={settings} onSave={handleSave} />
      )}
      {activeSection === 'integrations' && (
        <IntegrationSettings settings={settings} onSave={handleSave} />
      )}
      {activeSection === 'advanced' && (
        <AdvancedSettings settings={settings} onSave={handleSave} />
      )}
    </div>
  );
}

export default ConfiguracionPage;


/* =========================
   2. Subcomponentes Internos
   ========================= */

// 2.1 GeneralSettings
function GeneralSettings({ settings, onSave }) {
  const [nombreSistema, setNombreSistema] = useState(settings?.nombreSistema || 'RentaPlay');
  const [tema, setTema] = useState(settings?.tema || 'light');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...settings,
      nombreSistema,
      tema,
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Configuración General</h2>
      <form onSubmit={handleSubmit}>
        {/* Nombre */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Nombre del Sistema
          </label>
          <input
            type="text"
            value={nombreSistema}
            onChange={(e) => setNombreSistema(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>

        {/* Tema */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Tema
          </label>
          <select
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
          >
            <option value="light">Claro</option>
            <option value="dark">Oscuro</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}


// 2.2 PaymentSettings
function PaymentSettings({ settings, onSave }) {
  const [moneda, setMoneda] = useState(settings?.moneda || 'USD');
  const [plazoPago, setPlazoPago] = useState(settings?.plazoPago || 30);
  const [impuestos, setImpuestos] = useState(settings?.impuestos || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...settings,
      moneda,
      plazoPago,
      impuestos,
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Configuración de Pagos</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Moneda</label>
          <input
            type="text"
            value={moneda}
            onChange={(e) => setMoneda(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Plazo de Pago (días)
          </label>
          <input
            type="number"
            value={plazoPago}
            onChange={(e) => setPlazoPago(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Impuestos (%)
          </label>
          <input
            type="number"
            value={impuestos}
            onChange={(e) => setImpuestos(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}


// 2.3 NotificationSettings
function NotificationSettings({ settings, onSave }) {
  const [habilitarEmails, setHabilitarEmails] = useState(settings?.habilitarEmails ?? true);
  const [habilitarSMS, setHabilitarSMS] = useState(settings?.habilitarSMS ?? false);
  const [correoSoporte, setCorreoSoporte] = useState(settings?.correoSoporte || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...settings,
      habilitarEmails,
      habilitarSMS,
      correoSoporte,
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Configuración de Notificaciones</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex items-center space-x-2">
          <input
            type="checkbox"
            checked={habilitarEmails}
            onChange={(e) => setHabilitarEmails(e.target.checked)}
          />
          <label className="text-sm font-medium text-gray-700">
            Habilitar Notificaciones por Email
          </label>
        </div>

        <div className="mb-4 flex items-center space-x-2">
          <input
            type="checkbox"
            checked={habilitarSMS}
            onChange={(e) => setHabilitarSMS(e.target.checked)}
          />
          <label className="text-sm font-medium text-gray-700">
            Habilitar Notificaciones por SMS
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Correo de Soporte
          </label>
          <input
            type="email"
            value={correoSoporte}
            onChange={(e) => setCorreoSoporte(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}


// 2.4 IntegrationSettings
function IntegrationSettings({ settings, onSave }) {
  const [apiKey, setApiKey] = useState(settings?.apiKey || '');
  const [urlApiExterna, setUrlApiExterna] = useState(settings?.urlApiExterna || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...settings,
      apiKey,
      urlApiExterna,
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Integraciones</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">API Key</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            URL de la API Externa
          </label>
          <input
            type="text"
            value={urlApiExterna}
            onChange={(e) => setUrlApiExterna(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}


// 2.5 AdvancedSettings
function AdvancedSettings({ settings, onSave }) {
  const [habilitarLogs, setHabilitarLogs] = useState(settings?.habilitarLogs ?? false);
  const [mantenimiento, setMantenimiento] = useState(settings?.mantenimiento ?? false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...settings,
      habilitarLogs,
      mantenimiento,
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Configuraciones Avanzadas</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex items-center space-x-2">
          <input
            type="checkbox"
            checked={habilitarLogs}
            onChange={(e) => setHabilitarLogs(e.target.checked)}
          />
          <label className="text-sm font-medium text-gray-700">
            Habilitar Logs del Sistema
          </label>
        </div>

        <div className="mb-4 flex items-center space-x-2">
          <input
            type="checkbox"
            checked={mantenimiento}
            onChange={(e) => setMantenimiento(e.target.checked)}
          />
          <label className="text-sm font-medium text-gray-700">
            Activar Modo Mantenimiento
          </label>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}

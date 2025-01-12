// src/pages/Configuracion.page.jsx
import React, { useState, useEffect } from 'react';
import { ConfiguracionService } from '../services/Configuracion.service';
import GeneralSettings from '../components/Configuracion/GeneralSettings';
import PaymentSettings from '../components/Configuracion/PaymentSettings';
import NotificationSettings from '../components/Configuracion/NotificationSettings';

const Configuracion = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const config = await ConfiguracionService.getSettings();
        setSettings(config);
      } catch (err) {
        console.error('Error al cargar la configuración:', err);
        setError('Hubo un problema al cargar la configuración.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (updatedSettings) => {
    try {
      await ConfiguracionService.updateSettings(updatedSettings);
      setSettings(updatedSettings);
      alert('Configuración actualizada con éxito.');
    } catch (err) {
      console.error('Error al guardar la configuración:', err);
      alert('Error al guardar la configuración.');
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Cargando configuración...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">⚙️ Configuración</h1>
      <GeneralSettings settings={settings} onSave={handleSave} />
      <PaymentSettings settings={settings} onSave={handleSave} />
      <NotificationSettings settings={settings} onSave={handleSave} />
    </div>
  );
};

export default Configuracion;

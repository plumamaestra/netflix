// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './router.jsx';
import { PagoService } from './services/Pago.service';
import LoadingScreen from './components/LoadingScreen'; // Tu pantalla de carga

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Ejecutamos la lógica de generación de pagos pendientes
        await PagoService.generatePendingPayments();
      } catch (err) {
        console.error('Error al generar pagos pendientes:', err);
        setError('Ocurrió un error al inicializar la aplicación. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-xl font-semibold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Recargar Página
          </button>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;

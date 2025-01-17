// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './router.jsx';
import { PagoService } from './services/Pago.service';
import LoadingScreen from './components/LoadingScreen'; 
import { UserProvider } from './context/UserContext';

function App() {
  const [appError, setAppError] = useState('');
  const [loadingApp, setLoadingApp] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Lógica de pagos pendientes
        await PagoService.generatePendingPayments();
      } catch (err) {
        console.error('Error al generar pagos pendientes:', err);
        setAppError('Ocurrió un error al inicializar la aplicación.');
      } finally {
        setLoadingApp(false);
      }
    };
    initializeApp();
  }, []);

  if (loadingApp) {
    return <LoadingScreen />;
  }

  if (appError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100">
        {/* manejo de error */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-xl font-semibold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{appError}</p>
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
    <UserProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;

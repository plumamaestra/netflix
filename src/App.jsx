import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './router.jsx';
import { PagoService } from './services/Pago.service';
import LoadingScreen from './components/LoadingScreen'; // Tu pantalla de carga

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Ejecutamos la lógica de generación de pagos pendientes
    PagoService.generatePendingPayments();

    // 2. Forzamos que se muestre la pantalla de carga por 3 segundos
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    // 3. Limpiamos el timeout si el componente se desmonta antes de los 3s (buenas prácticas)
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;

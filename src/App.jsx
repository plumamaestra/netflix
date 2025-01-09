import React,  { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './router.jsx';
import { PagoService } from './services/Pago.service';


function App() {
  useEffect(() => {
    // Generar pagos pendientes al iniciar la aplicación
    PagoService.generatePendingPayments();
  }, []);
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;

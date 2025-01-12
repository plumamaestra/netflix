import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Servicios from './pages/Servicios';
import Pagos from './pages/Pagos';
import Reportes from './pages/Reportes';
import Login from './pages/Login';
import Plantillas from './pages/Plantillas';
import Configuracion from './pages/Configuracion';

function Router() {
  return (
    <Routes>
      {/* Página de Login sin Layout */}
      <Route path="/login" element={<Login />} />

      {/* Rutas con Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="servicios" element={<Servicios />} />
        <Route path="pagos" element={<Pagos />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="plantillas" element={<Plantillas />} />
        <Route path="settings" element={<Configuracion />} />
      </Route>
    </Routes>
  );
}

export default Router;

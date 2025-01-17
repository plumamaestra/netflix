// src/layout/Layout.jsx
import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  FileText,
  Settings,
  Shield,
  Menu as MenuIcon,
  X,
  Bell,
  User as UserIcon,
} from 'lucide-react';

import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { UserContext } from '../context/UserContext';

const Layout = () => {
  const { user, role, loading } = useContext(UserContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Redireccionar a /login si no hay usuario autenticado
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  // Manejo de carga inicial
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-700 text-lg">Cargando...</p>
      </div>
    );
  }

  // Si terminó de cargar y no hay usuario, no renderizamos nada
  if (!user) {
    return null;
  }

  // Íconos y rutas en el menú
  const menuItemsAdmin = [
    { icon: <LayoutDashboard size={20} />, text: 'Dashboard', path: '/' },
    { icon: <Users size={20} />, text: 'Clientes', path: '/clientes' },
    { icon: <Package size={20} />, text: 'Servicios', path: '/servicios' },
    { icon: <CreditCard size={20} />, text: 'Pagos', path: '/pagos' },
    { icon: <FileText size={20} />, text: 'Reportes', path: '/reportes' },
  ];

  const menuItemsCliente = [
    { icon: <CreditCard size={20} />, text: 'Pagos', path: '/pagos' },
    { icon: <FileText size={20} />, text: 'Reportes', path: '/reportes' },
  ];

  const generalItems = [
    { icon: <Settings size={20} />, text: 'Configuración', path: '/settings' },
    { icon: <Shield size={20} />, text: 'Seguridad', path: '/security' },
  ];

  // Componente para renderizar cada link del menú
  const MenuLink = ({ item }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center px-4 py-2 rounded-lg transition-colors ${
          isActive ? 'bg-green-800 text-white' : 'text-gray-300 hover:bg-green-700'
        }`
      }
    >
      <span className="mr-3">{item.icon}</span>
      {isSidebarOpen && <span>{item.text}</span>}
    </NavLink>
  );

  // Cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-green-950 text-white flex flex-col transition-all duration-300 fixed h-full z-40`}
      >
        {/* Logo */}
        <div className="px-4 py-6 flex items-center justify-between border-b border-green-800">
          <div className="flex items-center">
            <span className="text-lime-500 text-2xl">*</span>
            {isSidebarOpen && (
              <span className="ml-2 text-white text-xl font-semibold">
                RentaPlay
              </span>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-300 hover:text-white"
          >
            {isSidebarOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>

        {/* Menú Principal */}
        <div className="flex-1 px-2 overflow-y-auto">
          <div className="mb-4">
            {isSidebarOpen && (
              <p className="px-4 text-xs text-gray-400 uppercase mb-2">Menu</p>
            )}
            <nav className="space-y-1">
              {(role === 'admin' ? menuItemsAdmin : menuItemsCliente).map(
                (item, index) => (
                  <MenuLink key={index} item={item} />
                )
              )}
            </nav>
          </div>

          {/* Menú General */}
          <div>
            {isSidebarOpen && (
              <p className="px-4 text-xs text-gray-400 uppercase mb-2">
                General
              </p>
            )}
            <nav className="space-y-1">
              {generalItems.map((item, index) => (
                <MenuLink key={index} item={item} />
              ))}
            </nav>
          </div>
        </div>

        {/* Perfil */}
        <div className="p-4 border-t border-green-800">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-lime-500 flex items-center justify-center mr-3">
              <span className="text-green-950 text-sm">
                {user?.displayName ? user.displayName.charAt(0) : 'U'}
              </span>
            </div>
            {isSidebarOpen && (
              <div>
                <h3 className="text-sm font-medium">
                  {user?.displayName || 'Usuario'}
                </h3>
                <p className="text-xs text-gray-400">{user?.email}</p>
                <p className="text-xs text-gray-400">
                  {role === 'admin' ? 'Administrador' : 'Cliente'}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Top Navigation */}
        <div className="bg-white border-b h-16 flex items-center px-6 sticky top-0 z-30 shadow-md">
          <h1 className="text-xl font-semibold text-gray-800">
            {/* Título dinámico basado en la ruta actual (opcional) */}
            {menuItemsAdmin.find((item) => item.path === location.pathname)?.text ||
              'Dashboard'}
          </h1>
          <div className="ml-auto flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <UserIcon size={20} />
            </button>
          </div>
        </div>

        {/* Contenido de las páginas hijas */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;

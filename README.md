# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


# 📂 Estructura de Carpetas

/src
  ├── assets/         # Imágenes y recursos
  ├── components/     # Componentes reutilizables (Botones, Modales, etc.)
  ├── layouts/        # Layout principal (Sidebar, Header)
  ├── models/         # Modelos de datos (Clientes, Servicios, Pagos, etc.)
  │   ├── Cliente.model.js
  │   ├── Servicio.model.js
  │   ├── Pago.model.js
  ├── pages/          # Páginas principales
  │   ├── Dashboard.jsx
  │   ├── Clientes.jsx
  │   ├── Servicios.jsx
  │   ├── Pagos.jsx
  │   ├── Reportes.jsx
  ├── router.jsx      # Definición de rutas
  ├── services/       # Lógica para manejar datos (API, LocalStorage, etc.)
  ├── utils/          # Funciones de utilidad (formatos de fecha, moneda, etc.)
  ├── App.jsx         # Punto de entrada principal
  ├── index.jsx       # Renderizado de React
  ├── styles/         # Archivos de Tailwind y CSS globales

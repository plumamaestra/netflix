# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


# 📂 Estructura de Carpetas

/src
  ├── assets/         # Imágenes y recursos estáticos (logos, íconos, etc.)
  ├── components/     # Componentes reutilizables divididos por áreas funcionales
  │   ├── Clientes/   # Componentes específicos para gestionar clientes
  │   ├── Dashboard/  # Componentes del panel principal
  │   ├── Pagos/      # Componentes relacionados con la gestión de pagos
  │   ├── Plantillas/ # Componentes para generación de plantillas o documentos
  │   ├── Reportes/   # Componentes de visualización de reportes
  │   ├── Servicios/  # Componentes relacionados con la gestión de servicios
  │   └── WhatsApp/   # Componentes para la integración de WhatsApp
  ├── layouts/        # Layouts principales como Header, Sidebar, Footer
  ├── models/         # Modelos de datos para el proyecto
  │   ├── Cliente.model.js  # Modelo para clientes
  │   ├── Servicio.model.js # Modelo para servicios
  │   ├── Pago.model.js     # Modelo para pagos
  ├── pages/          # Páginas principales del proyecto
  │   ├── Dashboard.jsx # Página principal del Dashboard
  │   ├── Clientes.jsx  # Página para gestionar clientes
  │   ├── Servicios.jsx # Página para gestionar servicios
  │   ├── Pagos.jsx     # Página para registrar pagos
  │   ├── Reportes.jsx  # Página para visualización de reportes
  ├── services/       # Servicios para manejar lógica (API, LocalStorage, etc.)
  ├── router.jsx      # Configuración de rutas de la aplicación
  ├── utils/          # Funciones de utilidad como formatos de fecha, moneda, etc.
  ├── App.jsx         # Punto de entrada principal de la aplicación
  ├── index.jsx       # Archivo de renderizado principal
  ├── styles/         # Estilos globales y configuraciones de Tailwind

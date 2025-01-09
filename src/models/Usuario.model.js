// models/Usuario.model.js
export const UsuarioModel = {
    id: null,            // Identificador único del usuario
    nombre: '',          // Nombre del usuario
    correo: '',          // Correo electrónico
    rol: 'admin',        // Rol del usuario: admin | empleado
    contraseña: '',      // Contraseña (encriptada)
    ultimaSesion: '',    // Fecha de última sesión (ISO 8601)
  };
  
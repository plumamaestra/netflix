// src/components/LoadingScreen.jsx
import React from 'react';
import { Loader2 } from 'lucide-react'; // Asegúrate de tener lucide-react instalado

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="flex items-center space-x-2 mb-4">
        {/* Ícono principal con animación de giro */}
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
        {/* Título podría ser algo como "Cargando..." */}
        <h1 className="text-2xl text-blue-600 font-semibold tracking-wide">Cargando...</h1>
      </div>
      {/* Mensaje adicional con animación "pulse" en el color del texto */}
      <p className="text-gray-600 font-medium animate-pulse">
        Por favor, espere un momento
      </p>
    </div>
  );
};

export default LoadingScreen;

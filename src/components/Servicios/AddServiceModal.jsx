// src/components/Servicios/AddServiceModal.jsx
import React, { useState, useEffect } from 'react';

const AddServiceModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    precioMensual: '',
    descripcion: '',
    estado: 'disponible',
    proximaFechaPago: '',
  });

  const [errors, setErrors] = useState({
    nombre: '',
    precioMensual: '',
    proximaFechaPago: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorFetch, setErrorFetch] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        nombre: '',
        precioMensual: '',
        descripcion: '',
        estado: 'disponible',
        proximaFechaPago: '',
      });
    }
    setErrors({
      nombre: '',
      precioMensual: '',
      proximaFechaPago: '',
    });
    setErrorFetch('');
  }, [initialData, isOpen]);

  /**
   * Manejar cambios en los campos del formulario
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'nombre') {
      // Convertir el nombre a mayúsculas
      setFormData({ ...formData, [name]: value.toUpperCase() });
    } else if (name === 'precioMensual') {
      // Validar que el precio sea numérico
      if (!/^\d*\.?\d*$/.test(value)) return; // Solo permitir números y punto decimal
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    setErrors({ ...errors, [name]: '' }); // Limpiar errores al modificar el campo
  };

  /**
   * Validar los campos requeridos antes de enviar
   */
  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del servicio es obligatorio.';
      valid = false;
    }

    if (!formData.precioMensual.trim()) {
      newErrors.precioMensual = 'El precio mensual es obligatorio.';
      valid = false;
    } else if (isNaN(Number(formData.precioMensual))) {
      newErrors.precioMensual = 'El precio mensual debe ser un número válido.';
      valid = false;
    }

    if (!formData.proximaFechaPago.trim()) {
      newErrors.proximaFechaPago = 'La fecha de próximo pago es obligatoria.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  /**
   * Manejar el envío del formulario
   */
  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        await onSave(formData);
      } catch (err) {
        console.error('Error al guardar servicio:', err);
        setErrorFetch('Error al guardar el servicio.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? 'Editar Servicio' : 'Agregar Servicio'}
        </h2>

        {/* Nombre (Mayúsculas Automáticas) */}
        <input
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          className={`w-full mb-2 p-2 border rounded ${
            errors.nombre ? 'border-red-500' : ''
          }`}
        />
        {errors.nombre && (
          <p className="text-red-500 text-xs mb-2">{errors.nombre}</p>
        )}

        {/* Precio Mensual */}
        <input
          name="precioMensual"
          placeholder="Precio Mensual"
          value={formData.precioMensual}
          onChange={handleChange}
          className={`w-full mb-2 p-2 border rounded ${
            errors.precioMensual ? 'border-red-500' : ''
          }`}
        />
        {errors.precioMensual && (
          <p className="text-red-500 text-xs mb-2">{errors.precioMensual}</p>
        )}

        {/* Descripción (Opcional) */}
        <input
          name="descripcion"
          placeholder="Descripción (Opcional)"
          value={formData.descripcion}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />

        {/* Próxima Fecha de Pago */}
        <input
          name="proximaFechaPago"
          type="date"
          value={formData.proximaFechaPago}
          onChange={handleChange}
          className={`w-full mb-2 p-2 border rounded ${
            errors.proximaFechaPago ? 'border-red-500' : ''
          }`}
        />
        {errors.proximaFechaPago && (
          <p className="text-red-500 text-xs mb-2">{errors.proximaFechaPago}</p>
        )}

        {/* Mensaje de Error */}
        {errorFetch && (
          <div className="text-red-500 text-sm mb-4">
            ⚠️ {errorFetch}
          </div>
        )}

        {/* Botones */}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;

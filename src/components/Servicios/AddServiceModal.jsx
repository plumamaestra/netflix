import React, { useState, useEffect } from 'react';

const AddServiceModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    estado: 'Activo',
    proximaFechaPago: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    price: '',
    proximaFechaPago: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        price: '',
        description: '',
        estado: 'Activo',
        proximaFechaPago: '',
      });
    }
  }, [initialData]);

  /**
   * Manejar cambios en los campos del formulario
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name') {
      // Convertir el nombre a mayúsculas
      setFormData({ ...formData, [name]: value.toUpperCase() });
    } else if (name === 'price') {
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

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del servicio es obligatorio.';
      valid = false;
    }

    if (!formData.price.trim()) {
      newErrors.price = 'El precio mensual es obligatorio.';
      valid = false;
    } else if (isNaN(Number(formData.price))) {
      newErrors.price = 'El precio mensual debe ser un número válido.';
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
  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? 'Editar Servicio' : 'Agregar Servicio'}
        </h2>

        {/* Nombre (Mayúsculas Automáticas) */}
        <input
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          className={`w-full mb-2 p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && <p className="text-red-500 text-xs mb-2">{errors.name}</p>}

        {/* Precio Mensual */}
        <input
          name="price"
          placeholder="Precio Mensual"
          value={formData.price}
          onChange={handleChange}
          className={`w-full mb-2 p-2 border rounded ${errors.price ? 'border-red-500' : ''}`}
        />
        {errors.price && <p className="text-red-500 text-xs mb-2">{errors.price}</p>}

        {/* Descripción (Opcional) */}
        <input
          name="description"
          placeholder="Descripción (Opcional)"
          value={formData.description}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />

        {/* Próxima Fecha de Pago */}
        <input
          name="proximaFechaPago"
          type="date"
          value={formData.proximaFechaPago}
          onChange={handleChange}
          className={`w-full mb-2 p-2 border rounded ${errors.proximaFechaPago ? 'border-red-500' : ''}`}
        />
        {errors.proximaFechaPago && (
          <p className="text-red-500 text-xs mb-2">{errors.proximaFechaPago}</p>
        )}

        {/* Botones */}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;

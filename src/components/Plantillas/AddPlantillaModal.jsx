// src/components/Plantillas/AddPlantillaModal.jsx
import React, { useState, useEffect } from 'react';

const AddPlantillaModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    tipo: '',
    contenido: '',
  });

  useEffect(() => {
    // Si hay datos iniciales (editar plantilla), se cargan
    if (initialData) {
      setFormData({
        tipo: initialData.tipo || '',
        contenido: initialData.contenido || '',
      });
    } else {
      // Si no, restablecer el formulario al abrir
      setFormData({
        tipo: '',
        contenido: '',
      });
    }
  }, [initialData, isOpen]); // Se ejecuta cuando 'isOpen' cambia

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.tipo || !formData.contenido) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    try {
      await onSave(formData); // onSave debe manejar la lógica de agregar o actualizar
      onClose();
      setFormData({
        tipo: '',
        contenido: '',
      });
    } catch (error) {
      console.error("Error al guardar la plantilla:", error);
      alert("Ocurrió un error al guardar la plantilla. Por favor, inténtalo de nuevo.");
    }
  };

  const handleClose = () => {
    onClose();
    setFormData({
      tipo: '',
      contenido: '',
    }); // Limpiar los datos al cerrar el modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-full overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? 'Editar Plantilla' : 'Agregar Plantilla'}
        </h2>

        <label className="block mb-1 font-medium text-gray-700">Tipo</label>
        <select
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="">Seleccionar tipo</option>
          <option value="Nuevo Cliente">Nuevo Cliente</option>
          <option value="Pago Pendiente">Pago Pendiente</option>
          <option value="Pago Realizado">Pago Realizado</option>
        </select>

        <label className="block mb-1 font-medium text-gray-700">Contenido</label>
        <textarea
          name="contenido"
          value={formData.contenido}
          onChange={handleChange}
          placeholder="Contenido del mensaje"
          className="w-full mb-4 p-2 border rounded"
          rows="4"
        />

        <div className="flex justify-end space-x-2">
          <button
            onClick={handleClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPlantillaModal;

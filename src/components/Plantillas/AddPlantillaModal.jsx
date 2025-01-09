import React, { useState, useEffect } from 'react';

const AddPlantillaModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    tipo: '',
    contenido: '',
  });

  useEffect(() => {
    // Si hay datos iniciales (editar plantilla), se cargan
    if (initialData) {
      setFormData(initialData);
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

  const handleSubmit = () => {
    if (!formData.tipo || !formData.contenido) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    // Usamos el callback onSave para manejar otras lógicas de guardado
    onSave(formData); // Solo usar onSave para guardar la plantilla

    // Limpiar formulario después de guardar
    setFormData({
      tipo: '',
      contenido: '',
    });
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? 'Editar Plantilla' : 'Agregar Plantilla'}
        </h2>

        <select
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        >
          <option value="">Seleccionar tipo</option>
          <option value="NuevoCliente">Nuevo Cliente</option>
          <option value="PagoPendiente">Pago Pendiente</option>
          <option value="PagoRealizado">Pago Realizado</option>
        </select>

        <textarea
          name="contenido"
          value={formData.contenido}
          onChange={handleChange}
          placeholder="Contenido del mensaje"
          className="w-full mb-2 p-2 border rounded"
        />

        <div className="flex justify-end space-x-2">
          <button onClick={handleClose} className="bg-gray-300 px-4 py-2 rounded">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPlantillaModal;

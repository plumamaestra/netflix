import React, { useState, useEffect } from 'react';
import { ServicioService } from '../../services/Servicio.service';

const AddClientModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    estado: 'Activo',
    servicios: '',
    proximaFechaPago: '',
  });

  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [error, setError] = useState(''); // Para advertencias

  /**
   * Cargar servicios disponibles y datos iniciales
   */
  useEffect(() => {
    setServiciosDisponibles(ServicioService.getServices());

    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        phone: '',
        estado: 'Activo',
        servicios: '',
        proximaFechaPago: '',
      });
    }
  }, [initialData]);

  /**
   * Manejar cambios en los inputs
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Manejar selección del servicio
   */
  const handleServiceChange = (e) => {
    const selectedServiceId = e.target.value;
    setFormData({ ...formData, servicios: selectedServiceId });

    // Buscar el servicio seleccionado para obtener la fecha de pago
    const selectedService = serviciosDisponibles.find(
      (servicio) => servicio.id === selectedServiceId
    );

    if (selectedService && selectedService.proximaFechaPago) {
      setFormData((prevData) => ({
        ...prevData,
        proximaFechaPago: selectedService.proximaFechaPago,
      }));
      setError(''); // Limpiar errores si todo está bien
    } else {
      setError('El servicio seleccionado no tiene una fecha válida de próximo pago.');
      setFormData((prevData) => ({
        ...prevData,
        proximaFechaPago: '',
      }));
    }
  };

  /**
   * Guardar Cliente
   */
  const handleSubmit = () => {
    try {
      if (!formData.proximaFechaPago) {
        throw new Error('Debe seleccionar un servicio con una próxima fecha de pago válida.');
      }

      onSave(formData);
      setError('');
    } catch (error) {
      console.error('Error al guardar cliente:', error.message);
      setError(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? 'Editar Cliente' : 'Agregar Cliente'}
        </h2>
        
        {/* Campo Nombre */}
        <input
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />
        
        {/* Campo Teléfono */}
        <input
          name="phone"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />
        
        {/* Estado */}
        <select
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
        
        {/* Servicio */}
        <label className="block mb-1 text-sm text-gray-600">Servicio</label>
        <select
          name="servicios"
          value={formData.servicios}
          onChange={handleServiceChange}
          className="w-full mb-2 p-2 border rounded"
        >
          <option value="">Selecciona un servicio</option>
          {serviciosDisponibles.map((servicio) => (
            <option key={servicio.id} value={servicio.id}>
              {servicio.name} (${servicio.precioMensual}/mes)
            </option>
          ))}
        </select>
        
        {/* Próxima Fecha de Pago */}
        <input
          name="proximaFechaPago"
          type="date"
          value={formData.proximaFechaPago}
          readOnly
          className="w-full mb-4 p-2 border rounded bg-gray-100 cursor-not-allowed"
        />
        
        {/* Mensaje de Error */}
        {error && (
          <div className="text-red-500 text-sm mb-4">
            ⚠️ {error}
          </div>
        )}
        
        {/* Botones de Acción */}
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
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

export default AddClientModal;

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { ServicioService } from '../../services/Servicio.service';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';

const AddClientModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    estado: 'Activo',
    servicios: '',
    proximaFechaPago: '',
    email: '', // Agregar el campo de email para el usuario
    password: '', // Agregar el campo de password
  });

  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Para advertencias

  useEffect(() => {
    if (!isOpen) return;

    const fetchServicios = async () => {
      setLoading(true);
      try {
        const servicios = await ServicioService.getServices();
        setServiciosDisponibles(servicios);
      } catch (err) {
        console.error('Error al cargar servicios:', err);
        setError('No se pudieron cargar los servicios disponibles.');
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();

    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        phone: '',
        estado: 'Activo',
        servicios: '',
        proximaFechaPago: '',
        email: '', // Limpiar email
        password: '', // Limpiar password
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceChange = async (e) => {
    const selectedServiceId = e.target.value;
    setFormData({ ...formData, servicios: selectedServiceId });

    if (!selectedServiceId) {
      setError('Debe seleccionar un servicio.');
      setFormData((prevData) => ({
        ...prevData,
        proximaFechaPago: '',
      }));
      return;
    }

    try {
      const selectedService = await ServicioService.getServiceById(selectedServiceId);

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
    } catch (err) {
      console.error('Error al obtener el servicio:', err);
      setError('Error al obtener detalles del servicio.');
      setFormData((prevData) => ({
        ...prevData,
        proximaFechaPago: '',
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.proximaFechaPago) {
        throw new Error('Debe seleccionar un servicio con una próxima fecha de pago válida.');
      }

      // Primero creamos el usuario con el correo y la contraseña
      const { email, password } = formData;

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Asegúrate de que `servicios` sea un arreglo y agrega `fechaCreacion`
      const clienteData = {
        ...formData,
        servicios: formData.servicios ? [formData.servicios] : [], // Convertir a arreglo
        fechaCreacion: new Date().toISOString(), // Fecha actual en formato ISO
        userId: user.uid, // Guardamos el UID del usuario creado
        rol: 'cliente', // Asignamos el rol como "cliente"
      };

      // Guardamos al cliente en Firestore
      await onSave(clienteData);

      // Agregar un mensaje de éxito
      message.success('Cliente creado correctamente.');
      onClose(); // Cerrar el modal
      setError('');
    } catch (error) {
      console.error('Error al guardar cliente:', error.message);
      setError(error.message || 'Error al guardar el cliente.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? 'Editar Cliente' : 'Agregar Cliente'}
        </h2>

        {/* Campos del formulario */}
        <input
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />

        <input
          name="phone"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />

        <input
          name="email"
          type="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />

        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />

        <select
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>

        <label className="block mb-1 text-sm text-gray-600">Servicio</label>
        {loading ? (
          <p>Cargando servicios...</p>
        ) : (
          <select
            name="servicios"
            value={formData.servicios}
            onChange={handleServiceChange}
            className="w-full mb-2 p-2 border rounded"
          >
            <option value="">Selecciona un servicio</option>
            {serviciosDisponibles.map((servicio) => (
              <option key={servicio.id} value={servicio.id}>
                {servicio.nombre} (${servicio.precioMensual}/mes)
              </option>
            ))}
          </select>
        )}

        <input
          name="proximaFechaPago"
          type="date"
          value={formData.proximaFechaPago}
          readOnly
          className="w-full mb-4 p-2 border rounded bg-gray-100 cursor-not-allowed"
        />

        {error && (
          <div className="text-red-500 text-sm mb-4">
            ⚠️ {error}
          </div>
        )}

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

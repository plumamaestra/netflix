// src/components/Pagos/AddPagoModal.jsx
import React, { useState, useEffect } from 'react';
import { ClienteService } from '../../services/Cliente.service';
import { ServicioService } from '../../services/Servicio.service';

const AddPagoModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    clienteId: '',
    clienteNombre: '',
    phone: '',
    servicioId: '',
    servicio: '',
    monto: '',
    fechaPago: new Date().toISOString().split('T')[0],
    estado: 'Pendiente',
    numeroMeses: 1,
  });

  const [allServices, setAllServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [loadingClientes, setLoadingClientes] = useState(false);
  const [loadingServicios, setLoadingServicios] = useState(false);
  const [errorClientes, setErrorClientes] = useState('');
  const [errorServicios, setErrorServicios] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setLoadingClientes(true);
      setLoadingServicios(true);
      try {
        const [clientesData, serviciosData] = await Promise.all([
          ClienteService.getClients(),
          ServicioService.getServices(),
        ]);
        setClientes(clientesData);
        setAllServices(serviciosData);

        if (initialData) {
          // Verificar si servicioId es una referencia y extraer el ID
          const servicioId =
            initialData.servicioId && initialData.servicioId.id
              ? initialData.servicioId.id
              : initialData.servicioId;

          setFormData({
            clienteId: initialData.clienteId,
            clienteNombre: initialData.clienteNombre,
            phone: initialData.phone,
            servicioId: servicioId || '',
            servicio: initialData.servicio || '',
            monto: initialData.monto || '',
            fechaPago: initialData.fechaPago || new Date().toISOString().split('T')[0],
            estado: initialData.estado || 'Pendiente',
            numeroMeses: initialData.numeroMeses || 1,
          });

          // Filtrar servicios según el cliente si se está editando
          const selectedCliente = clientesData.find(c => c.id === initialData.clienteId);
          if (selectedCliente) {
            // Extraer IDs de los servicios referenciados
            const servicioIds = Array.isArray(selectedCliente.servicios)
              ? selectedCliente.servicios.map(ref => ref.id)
              : selectedCliente.servicios && selectedCliente.servicios.id
              ? [selectedCliente.servicios.id]
              : [];

            const clientServices = serviciosData.filter(s => servicioIds.includes(s.id));
            setFilteredServices(clientServices);
          }
        } else {
          setFormData({
            clienteId: '',
            clienteNombre: '',
            phone: '',
            servicioId: '',
            servicio: '',
            monto: '',
            fechaPago: new Date().toISOString().split('T')[0],
            estado: 'Pendiente',
            numeroMeses: 1,
          });
          setFilteredServices([]);
        }

        // Resetear errores al abrir el modal
        setFormError('');
      } catch (err) {
        console.error('Error al cargar clientes o servicios:', err);
        if (!clientes.length) setErrorClientes('No se pudieron cargar los clientes.');
        if (!allServices.length) setErrorServicios('No se pudieron cargar los servicios.');
      } finally {
        setLoadingClientes(false);
        setLoadingServicios(false);
      }
    };

    fetchData();
  }, [initialData, isOpen]); // Eliminado 'clientes' y 'allServices' de las dependencias

  /**
   * Maneja el cambio de cliente en el select
   */
  const handleClienteChange = async (e) => {
    const clienteId = e.target.value;
    if (!clienteId) {
      // Si no hay cliente seleccionado, limpiamos la info
      setFormData({
        clienteId: '',
        clienteNombre: '',
        phone: '',
        servicioId: '',
        servicio: '',
        monto: '',
        fechaPago: new Date().toISOString().split('T')[0],
        estado: 'Pendiente',
        numeroMeses: 1,
      });
      setFilteredServices([]);
      return;
    }

    try {
      const selectedCliente = await ClienteService.getClientById(clienteId);
      setFormData(prev => ({
        ...prev,
        clienteId: selectedCliente.id,
        clienteNombre: selectedCliente.name,
        phone: selectedCliente.phone,
        servicioId: '',
        servicio: '',
        monto: '',
      }));

      // Filtramos los servicios que el cliente tiene contratado
      const servicioIds = Array.isArray(selectedCliente.servicios)
        ? selectedCliente.servicios.map(ref => ref.id)
        : selectedCliente.servicios && selectedCliente.servicios.id
        ? [selectedCliente.servicios.id]
        : [];

      const clientServices = allServices.filter(s => servicioIds.includes(s.id));
      setFilteredServices(clientServices);

      // AUTO-SELECCIONAMOS si tiene solo un servicio
      if (clientServices.length === 1) {
        const unicoServicio = clientServices[0];
        const total = unicoServicio.precioMensual * formData.numeroMeses;
        setFormData(prev => ({
          ...prev,
          servicioId: unicoServicio.id,
          servicio: unicoServicio.nombre,
          monto: total,
        }));
      }
    } catch (err) {
      console.error('Error al obtener el cliente:', err);
      setFormError('Error al obtener los datos del cliente seleccionado.');
    }
  };

  /**
   * Maneja el cambio de servicio
   */
  const handleServicioChange = async (e) => {
    const servicioId = e.target.value;
    if (!servicioId) {
      setFormData(prev => ({
        ...prev,
        servicioId: '',
        servicio: '',
        monto: '',
      }));
      return;
    }

    try {
      const selectedServicio = await ServicioService.getServiceById(servicioId);
      if (selectedServicio) {
        const total = selectedServicio.precioMensual * formData.numeroMeses;
        setFormData(prev => ({
          ...prev,
          servicioId: selectedServicio.id,
          servicio: selectedServicio.nombre,
          monto: total,
        }));
      }
    } catch (err) {
      console.error('Error al obtener el servicio:', err);
      setFormError('Error al obtener los datos del servicio seleccionado.');
    }
  };

  /**
   * Maneja el cambio de número de meses
   */
  const handleNumeroMesesChange = (e) => {
    const numeroMeses = parseInt(e.target.value, 10) || 1;
    const selectedServicio = allServices.find(s => s.id === formData.servicioId);

    if (selectedServicio) {
      const total = selectedServicio.precioMensual * numeroMeses;
      setFormData(prev => ({
        ...prev,
        numeroMeses,
        monto: total,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        numeroMeses,
      }));
    }
  };

  /**
   * Maneja el cambio en la fecha de pago
   */
  const handleFechaPagoChange = (e) => {
    const fechaPago = e.target.value;
    setFormData(prev => ({
      ...prev,
      fechaPago,
    }));
  };

  /**
   * Maneja el cambio en el estado
   */
  const handleEstadoChange = (e) => {
    const estado = e.target.value;
    setFormData(prev => ({
      ...prev,
      estado,
    }));
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async () => {
    if (!formData.clienteId || !formData.servicioId || !formData.monto) {
      setFormError('Por favor, complete todos los campos obligatorios.');
      return;
    }

    try {
      await onSave(formData);
      onClose();
      setFormError('');
    } catch (err) {
      console.error('Error al guardar pago:', err);
      setFormError('Error al guardar el pago.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-full overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? 'Editar Pago' : 'Registrar Pago'}
        </h2>

        {/* Cliente */}
        <label className="block mb-1 font-medium text-gray-700">Cliente</label>
        {loadingClientes ? (
          <p>Cargando clientes...</p>
        ) : errorClientes ? (
          <p className="text-red-500">{errorClientes}</p>
        ) : (
          <select
            name="clienteId"
            value={formData.clienteId}
            onChange={handleClienteChange}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="">Seleccionar Cliente</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.name}
              </option>
            ))}
          </select>
        )}

        {/* Servicio (solo los que el cliente tiene) */}
        <label className="block mb-1 font-medium text-gray-700">Servicio</label>
        {loadingServicios ? (
          <p>Cargando servicios...</p>
        ) : errorServicios ? (
          <p className="text-red-500">{errorServicios}</p>
        ) : (
          <select
            name="servicioId"
            value={formData.servicioId}
            onChange={handleServicioChange}
            className="w-full mb-4 p-2 border rounded"
            disabled={filteredServices.length === 0}
          >
            <option value="">Seleccionar Servicio</option>
            {filteredServices.map(serv => (
              <option key={serv.id} value={serv.id}>
                {serv.nombre} (${serv.precioMensual}/mes)
              </option>
            ))}
          </select>
        )}

        {/* Número de meses */}
        <label className="block mb-1 font-medium text-gray-700">Número de meses</label>
        <input
          name="numeroMeses"
          type="number"
          min="1"
          value={formData.numeroMeses}
          onChange={handleNumeroMesesChange}
          className="w-full mb-4 p-2 border rounded"
        />

        {/* Monto total */}
        <label className="block mb-1 font-medium text-gray-700">Monto</label>
        <input
          name="monto"
          type="number"
          value={formData.monto}
          readOnly
          className="w-full mb-4 p-2 border rounded bg-gray-100 cursor-not-allowed"
        />

        {/* Fecha de pago */}
        <label className="block mb-1 font-medium text-gray-700">Fecha de Pago</label>
        <input
          name="fechaPago"
          type="date"
          value={formData.fechaPago}
          onChange={handleFechaPagoChange}
          className="w-full mb-4 p-2 border rounded"
        />

        {/* Estado */}
        <label className="block mb-1 font-medium text-gray-700">Estado</label>
        <select
          name="estado"
          value={formData.estado}
          onChange={handleEstadoChange}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="Pendiente">Pendiente</option>
          <option value="Pagado">Pagado</option>
        </select>

        {/* Mensaje de Error */}
        {formError && (
          <div className="text-red-500 text-sm mb-4">
            ⚠️ {formError}
          </div>
        )}

        {/* Botones */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
            disabled={loadingClientes || loadingServicios}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded"
            disabled={loadingClientes || loadingServicios}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPagoModal;

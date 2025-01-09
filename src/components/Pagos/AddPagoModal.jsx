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

  // Lista de todos los servicios disponibles
  const [allServices, setAllServices] = useState([]);
  // Lista de servicios *filtrados* (los que tiene el cliente)
  const [filteredServices, setFilteredServices] = useState([]);
  // Lista de clientes
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    setClientes(ClienteService.getClients());
    setAllServices(ServicioService.getServices());
    
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  /**
   * Maneja el cambio de cliente en el select
   */
  const handleClienteChange = (e) => {
    const clienteId = e.target.value;
    const selectedCliente = clientes.find((c) => c.id === clienteId);

    if (!selectedCliente) {
      // Si no hay cliente seleccionado, limpiamos la info
      setFormData((prev) => ({
        ...prev,
        clienteId: '',
        clienteNombre: '',
        phone: '',
        servicioId: '',
        servicio: '',
        monto: '',
      }));
      setFilteredServices([]);
      return;
    }

    // Actualizamos datos del cliente
    setFormData((prev) => ({
      ...prev,
      clienteId: selectedCliente.id,
      clienteNombre: selectedCliente.name,
      phone: selectedCliente.phone,
      // Limpiamos el servicio cuando se cambia de cliente
      servicioId: '',
      servicio: '',
      monto: '',
    }));

    // Filtramos los servicios que el cliente tiene contratado
    let clientServices = [];
    if (Array.isArray(selectedCliente.servicios)) {
      clientServices = allServices.filter((s) => selectedCliente.servicios.includes(s.id));
    } else if (selectedCliente.servicios) {
      // Caso: el cliente tiene un solo ID en "servicios"
      const singleService = allServices.find((s) => s.id === selectedCliente.servicios);
      clientServices = singleService ? [singleService] : [];
    }
    setFilteredServices(clientServices);

    // AUTO-SELECCIONAMOS si tiene solo un servicio
    if (clientServices.length === 1) {
      const unicoServicio = clientServices[0];
      // Calculamos monto inicial
      const total = unicoServicio.price * formData.numeroMeses;
      setFormData((prev) => ({
        ...prev,
        servicioId: unicoServicio.id,
        servicio: unicoServicio.name,
        monto: total,
      }));
    }
  };

  /**
   * Maneja el cambio de servicio
   */
  const handleServicioChange = (e) => {
    const servicioId = e.target.value;
    const selectedServicio = filteredServices.find((s) => s.id === servicioId);

    if (selectedServicio) {
      const total = selectedServicio.price * formData.numeroMeses;
      setFormData((prev) => ({
        ...prev,
        servicioId: selectedServicio.id,
        servicio: selectedServicio.name,
        monto: total,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        servicioId: '',
        servicio: '',
        monto: '',
      }));
    }
  };

  /**
   * Maneja el cambio de número de meses
   */
  const handleNumeroMesesChange = (e) => {
    const numeroMeses = parseInt(e.target.value, 10) || 1;
    const selectedServicio = filteredServices.find((s) => s.id === formData.servicioId);

    if (selectedServicio) {
      const total = selectedServicio.price * numeroMeses;
      setFormData((prev) => ({
        ...prev,
        numeroMeses,
        monto: total,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        numeroMeses,
      }));
    }
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = () => {
    if (!formData.clienteId || !formData.servicioId || !formData.monto) {
      alert('Por favor, complete todos los campos.');
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? 'Editar Pago' : 'Registrar Pago'}
        </h2>

        {/* Cliente */}
        <label className="block mb-1 font-medium text-gray-700">Cliente</label>
        <select
          name="clienteId"
          value={formData.clienteId}
          onChange={handleClienteChange}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="">Seleccionar Cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.name}
            </option>
          ))}
        </select>

        {/* Servicio (solo los que el cliente tiene) */}
        <label className="block mb-1 font-medium text-gray-700">Servicio</label>
        <select
          name="servicioId"
          value={formData.servicioId}
          onChange={handleServicioChange}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="">Seleccionar Servicio</option>
          {filteredServices.map((serv) => (
            <option key={serv.id} value={serv.id}>
              {serv.name} (${serv.price}/mes)
            </option>
          ))}
        </select>

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
          className="w-full mb-4 p-2 border rounded"
        />

        {/* Fecha de pago */}
        <label className="block mb-1 font-medium text-gray-700">Fecha de Pago</label>
        <input
          name="fechaPago"
          type="date"
          value={formData.fechaPago}
          onChange={(e) => setFormData({ ...formData, fechaPago: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />

        {/* Estado */}
        <label className="block mb-1 font-medium text-gray-700">Estado</label>
        <select
          name="estado"
          value={formData.estado}
          onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="Pendiente">Pendiente</option>
          <option value="Pagado">Pagado</option>
        </select>

        {/* Botones */}
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

export default AddPagoModal;

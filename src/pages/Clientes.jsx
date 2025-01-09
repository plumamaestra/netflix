import React, { useState, useEffect } from 'react';
import { ClienteService } from '../services/Cliente.service';
import ClientesTable from '../components/Clientes/ClientesTable';
import AddClientModal from '../components/Clientes/AddClientModal';

const Clientes = () => {
  const [clients, setClients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  /**
   * Cargar Clientes al iniciar
   */
  useEffect(() => {
    setClients(ClienteService.getClients());
  }, []);

  /**
   * Guardar Cliente (Agregar/Editar)
   */
  const handleSave = (client) => {
    if (editingClient) {
      ClienteService.updateClient(client.id, client);
    } else {
      ClienteService.addClient(client);
    }
    setClients(ClienteService.getClients());
    setModalOpen(false);
    setEditingClient(null);
  };

  /**
   * Eliminar Cliente
   */
  const handleDelete = (id) => {
    ClienteService.deleteClient(id);
    setClients(ClienteService.getClients());
  };

  /**
   * Abrir Modal para Agregar Cliente
   */
  const handleAddClient = () => {
    setEditingClient(null);
    setModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Encabezado */}
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">👥 Clientes</h1>
        <button
          onClick={handleAddClient}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          + Agregar Cliente
        </button>
      </div>

      {/* Tabla de Clientes */}
      <ClientesTable 
        clients={clients} 
        onEdit={(client) => {
          setEditingClient(client);
          setModalOpen(true);
        }} 
        onDelete={handleDelete} 
      />

      {/* Modal de Agregar/Editar Cliente */}
      <AddClientModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingClient}
      />
    </div>
  );
};

export default Clientes;

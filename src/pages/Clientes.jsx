// src/pages/Clientes.jsx
import React, { useState, useEffect } from 'react';
import { ClienteService } from '../services/Cliente.service';
import { PlantillaService } from '../services/Plantilla.service'; // Importa PlantillaService
import ClientesTable from '../components/Clientes/ClientesTable';
import AddClientModal from '../components/Clientes/AddClientModal';

const Clientes = () => {
  const [clients, setClients] = useState([]);
  const [plantillas, setPlantillas] = useState([]); // Estado para las plantillas
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [loadingClients, setLoadingClients] = useState(true); // Estado de carga para clientes
  const [loadingPlantillas, setLoadingPlantillas] = useState(true); // Estado de carga para plantillas
  const [error, setError] = useState('');

  /**
   * Cargar Clientes y Plantillas al iniciar
   */
  useEffect(() => {
    const fetchClients = async () => {
      setLoadingClients(true);
      try {
        const fetchedClients = await ClienteService.getClients();
        setClients(fetchedClients);
      } catch (err) {
        console.error('Error al obtener clientes:', err);
        setError('No se pudieron cargar los clientes.');
      } finally {
        setLoadingClients(false);
      }
    };

    const fetchPlantillas = async () => {
      setLoadingPlantillas(true);
      try {
        const fetchedPlantillas = await PlantillaService.getPlantillas();
        setPlantillas(fetchedPlantillas);
      } catch (err) {
        console.error('Error al obtener plantillas:', err);
        setError('No se pudieron cargar las plantillas.');
      } finally {
        setLoadingPlantillas(false);
      }
    };

    fetchClients();
    fetchPlantillas();
  }, []);

  /**
   * Guardar Cliente (Agregar/Editar)
   */
  const handleSave = async (client) => {
    try {
      if (editingClient) {
        await ClienteService.updateClient(editingClient.id, client);
        setClients(await ClienteService.getClients());
      } else {
        await ClienteService.addClient(client);
        setClients(await ClienteService.getClients());
      }
      setModalOpen(false);
      setEditingClient(null);
    } catch (err) {
      console.error('Error al guardar cliente:', err);
      setError('No se pudo guardar el cliente.');
    }
  };

  /**
   * Eliminar Cliente
   */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este cliente?');
    if (!confirmDelete) return;

    try {
      await ClienteService.deleteClient(id);
      setClients(await ClienteService.getClients());
    } catch (err) {
      console.error('Error al eliminar cliente:', err);
      setError('No se pudo eliminar el cliente.');
    }
  };

  /**
   * Abrir Modal para Agregar Cliente
   */
  const handleAddClient = () => {
    setEditingClient(null);
    setModalOpen(true);
  };

  if (loadingClients || loadingPlantillas) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-700">Cargando datos...</p>
      </div>
    );
  }

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

      {/* Mensaje de Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Tabla de Clientes */}
      <ClientesTable 
        clients={clients} 
        onEdit={(client) => {
          setEditingClient(client);
          setModalOpen(true);
        }} 
        onDelete={handleDelete} 
        plantillas={plantillas} // Pasamos las plantillas como prop
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

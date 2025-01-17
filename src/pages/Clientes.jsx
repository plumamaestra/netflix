// src/pages/Clientes.jsx
import React, { useState, useEffect } from 'react';
import { ClienteService } from '../services/Cliente.service';
import { PlantillaService } from '../services/Plantilla.service';
import ClientesTable from '../components/Clientes/ClientesTable';
import AddClientModal from '../components/Clientes/AddClientModal';

const Clientes = () => {
  const [clients, setClients] = useState([]);
  const [plantillas, setPlantillas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingPlantillas, setLoadingPlantillas] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      setLoadingClients(true);
      try {
        const fetchedClients = await ClienteService.getClients();
        setClients(fetchedClients);
      } catch (err) {
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
        setError('No se pudieron cargar las plantillas.');
      } finally {
        setLoadingPlantillas(false);
      }
    };

    fetchClients();
    fetchPlantillas();
  }, []);

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
      setError('No se pudo guardar el cliente.');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este cliente?');
    if (!confirmDelete) return;

    try {
      await ClienteService.deleteClient(id);
      setClients(await ClienteService.getClients());
    } catch (err) {
      setError('No se pudo eliminar el cliente.');
    }
  };

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
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <ClientesTable 
        clients={clients} 
        onEdit={(client) => {
          setEditingClient(client);
          setModalOpen(true);
        }} 
        onDelete={handleDelete} 
        plantillas={plantillas}
      />

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

import Cliente from '../models/Cliente.model';

const CLIENTES_KEY = 'clientes';

export const ClienteService = {
  // Obtener todos los clientes
  getClients: () => JSON.parse(localStorage.getItem(CLIENTES_KEY)) || [],

  // Obtener cliente por ID
  getClientById: (id) => ClienteService.getClients().find((client) => client.id === id),

  // Agregar cliente
  addClient: (client) => {
    const clients = ClienteService.getClients();
    const newClient = new Cliente(client);
    newClient.validate();
    clients.push({ ...newClient, id: Date.now().toString() });
    localStorage.setItem(CLIENTES_KEY, JSON.stringify(clients));
  },

  // Actualizar cliente
  updateClient: (id, updatedClient) => {
    const clients = ClienteService.getClients().map((client) =>
      client.id === id ? { ...client, ...updatedClient } : client
    );
    localStorage.setItem(CLIENTES_KEY, JSON.stringify(clients));
  },

  // Eliminar cliente
  deleteClient: (id) => {
    const clients = ClienteService.getClients().filter((client) => client.id !== id);
    localStorage.setItem(CLIENTES_KEY, JSON.stringify(clients));
  },
};

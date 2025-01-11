// services/Cliente.service.js
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { firestore } from '../firebase/firebaseConfig';
import Cliente from '../models/Cliente.model';

const CLIENTES_COLLECTION = 'clientes';

export const ClienteService = {
  /**
   * Obtener todos los clientes
   */
  getClients: async () => {
    const clientesCol = collection(firestore, CLIENTES_COLLECTION);
    const clientesSnapshot = await getDocs(clientesCol);
    const clientesList = clientesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return clientesList;
  },

  /**
   * Obtener cliente por ID
   */
  getClientById: async (id) => {
    const clienteDoc = doc(firestore, CLIENTES_COLLECTION, id);
    const clienteSnapshot = await getDoc(clienteDoc);
    if (clienteSnapshot.exists()) {
      return { id: clienteSnapshot.id, ...clienteSnapshot.data() };
    } else {
      throw new Error('Cliente no encontrado');
    }
  },

  /**
   * Agregar cliente
   */
  addClient: async (clientData) => {
    const clientesCol = collection(firestore, CLIENTES_COLLECTION);
    const newClient = new Cliente(clientData);
    newClient.validate();
    const docRef = await addDoc(clientesCol, { ...newClient });
    return { id: docRef.id, ...newClient };
  },

  /**
   * Actualizar cliente
   */
  updateClient: async (id, updatedClient) => {
    const clienteDoc = doc(firestore, CLIENTES_COLLECTION, id);
    await updateDoc(clienteDoc, updatedClient);
    return { id, ...updatedClient };
  },

  /**
   * Eliminar cliente
   */
  deleteClient: async (id) => {
    const clienteDoc = doc(firestore, CLIENTES_COLLECTION, id);
    await deleteDoc(clienteDoc);
  },
};

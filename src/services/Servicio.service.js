// services/Servicio.service.js
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { firestore } from '../firebase/firebaseConfig';

const SERVICIOS_COLLECTION = 'servicios';

export const ServicioService = {
  /**
   * Obtener todos los servicios
   */
  getServices: async () => {
    const serviciosCol = collection(firestore, SERVICIOS_COLLECTION);
    const serviciosSnapshot = await getDocs(serviciosCol);
    const serviciosList = serviciosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return serviciosList;
  },

  /**
   * Obtener servicio por ID
   */
  getServiceById: async (id) => {
    const servicioDoc = doc(firestore, SERVICIOS_COLLECTION, id);
    const servicioSnapshot = await getDoc(servicioDoc);
    if (servicioSnapshot.exists()) {
      return { id: servicioSnapshot.id, ...servicioSnapshot.data() };
    } else {
      throw new Error('Servicio no encontrado');
    }
  },

  /**
   * Agregar servicio
   */
  addService: async (serviceData) => {
    const serviciosCol = collection(firestore, SERVICIOS_COLLECTION);
    const servicio = { ...serviceData, fechaCreacion: new Date().toISOString() };
    const docRef = await addDoc(serviciosCol, servicio);
    return { id: docRef.id, ...servicio };
  },

  /**
   * Actualizar servicio
   */
  updateService: async (id, updatedService) => {
    const servicioDoc = doc(firestore, SERVICIOS_COLLECTION, id);
    await updateDoc(servicioDoc, updatedService);
    return { id, ...updatedService };
  },

  /**
   * Eliminar servicio
   */
  deleteService: async (id) => {
    const servicioDoc = doc(firestore, SERVICIOS_COLLECTION, id);
    await deleteDoc(servicioDoc);
  },
};

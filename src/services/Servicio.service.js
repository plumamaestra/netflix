// services/Servicio.service.js
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";

const SERVICIOS_COLLECTION = "servicios";

export const ServicioService = {
  /**
   * Obtener todos los servicios
   */
  getServices: async () => {
    const serviciosCol = collection(firestore, SERVICIOS_COLLECTION);
    const serviciosSnapshot = await getDocs(serviciosCol);
    const serviciosList = serviciosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return serviciosList;
  },

  /**
   * Obtener servicio por ID o referencia
   */
  getServiceById: async (servicioId) => {
    if (!servicioId) {
      throw new Error("El servicioId es nulo o indefinido.");
    }

    let id = servicioId;

    // Validar si servicioId es una referencia o cadena
    if (typeof servicioId === "string") {
      const parts = servicioId.split("/");
      id = parts.length > 1 ? parts[parts.length - 1] : servicioId; // Extraer el ID si es una referencia en string
    } else if (servicioId.id) {
      id = servicioId.id; // Usar directamente el ID de la referencia Firestore
    } else {
      throw new Error("El servicioId no es una referencia válida ni un string.");
    }

    // Obtener el documento desde Firestore
    try {
      const servicioDoc = await getDoc(doc(firestore, SERVICIOS_COLLECTION, id));
      if (!servicioDoc.exists()) {
        throw new Error(`Servicio con ID ${id} no encontrado.`);
      }
      return { id: servicioDoc.id, ...servicioDoc.data() };
    } catch (error) {
      console.error("Error al obtener el servicio:", error);
      throw new Error(`Error al obtener el servicio con ID ${id}.`);
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

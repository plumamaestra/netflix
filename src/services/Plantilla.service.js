// src/services/Plantilla.service.js
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { firestore } from '../firebase/firebaseConfig';

const PLANTILLAS_COLLECTION = 'plantillas';

export const PlantillaService = {
  /**
   * Obtener todas las plantillas desde Firestore
   */
  getPlantillas: async () => {
    try {
      const plantillasCol = collection(firestore, PLANTILLAS_COLLECTION);
      const plantillasSnapshot = await getDocs(plantillasCol);
      const plantillasList = plantillasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Plantillas recuperadas: ", plantillasList);
      return plantillasList;
    } catch (error) {
      console.error("Error al obtener plantillas: ", error);
      return [];
    }
  },

  /**
   * Agregar una nueva plantilla a Firestore
   */
  addPlantilla: async (plantilla) => {
    try {
      const plantillasCol = collection(firestore, PLANTILLAS_COLLECTION);
      const docRef = await addDoc(plantillasCol, plantilla);
      const newPlantilla = { id: docRef.id, ...plantilla };
      console.log("Plantilla agregada correctamente: ", newPlantilla);
      return newPlantilla;
    } catch (error) {
      console.error("Error al agregar la plantilla en Firestore", error);
      throw error;
    }
  },

  /**
   * Actualizar una plantilla existente en Firestore
   */
  updatePlantilla: async (id, updatedPlantilla) => {
    try {
      const plantillaDoc = doc(firestore, PLANTILLAS_COLLECTION, id);
      await updateDoc(plantillaDoc, updatedPlantilla);
      const plantillaActualizada = { id, ...updatedPlantilla };
      console.log("Plantilla actualizada correctamente: ", plantillaActualizada);
      return plantillaActualizada;
    } catch (error) {
      console.error("Error al actualizar la plantilla en Firestore", error);
      throw error;
    }
  },

  /**
   * Eliminar una plantilla de Firestore
   */
  deletePlantilla: async (id) => {
    try {
      const plantillaDoc = doc(firestore, PLANTILLAS_COLLECTION, id);
      await deleteDoc(plantillaDoc);
      console.log("Plantilla eliminada con id: ", id);
    } catch (error) {
      console.error("Error al eliminar la plantilla en Firestore", error);
      throw error;
    }
  },
};

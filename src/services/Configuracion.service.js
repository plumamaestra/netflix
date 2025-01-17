// src/services/Configuracion.service.js
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebaseConfig';

// Puedes cambiar la referencia si quieres más documentos o colecciones.
// Aquí, asumimos que guardas toda la configuración global en:
// Colección "configuracion" y Documento con id "configGlobal".
const CONFIG_DOC_REF = doc(firestore, 'configuracion', 'configGlobal');

export const ConfiguracionService = {
  /**
   * Obtiene la configuración global del sistema desde Firestore
   */
  getSettings: async () => {
    const snapshot = await getDoc(CONFIG_DOC_REF);
    if (snapshot.exists()) {
      return snapshot.data();
    }
    // Si el documento no existe, podrías crearlo vacío o retornar algo por defecto
    return {};
  },

  /**
   * Actualiza la configuración global del sistema en Firestore.
   * setDoc con merge:true para fusionar la data con la existente.
   */
  updateSettings: async (updatedSettings) => {
    await setDoc(CONFIG_DOC_REF, updatedSettings, { merge: true });
  },
};

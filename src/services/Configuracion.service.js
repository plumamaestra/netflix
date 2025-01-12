// src/services/Configuracion.service.js
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";

const CONFIGURACION_DOC = "configuracion/settings";

export const ConfiguracionService = {
  /**
   * Obtener configuración general
   */
  getSettings: async () => {
    try {
      const configDoc = doc(firestore, CONFIGURACION_DOC);
      const snapshot = await getDoc(configDoc);
      if (snapshot.exists()) {
        return snapshot.data();
      } else {
        return {
          general: {
            nombreSistema: "Mi Sistema",
            moneda: "USD",
          },
          pagos: {
            impuesto: 0,
            recargoRetraso: 0,
          },
          notificaciones: {
            habilitarRecordatorios: true,
            metodoEnvio: "WhatsApp",
          },
        };
      }
    } catch (error) {
      console.error("Error al obtener configuración:", error);
      throw error;
    }
  },

  /**
   * Actualizar configuración general
   */
  updateSettings: async (settings) => {
    try {
      const configDoc = doc(firestore, CONFIGURACION_DOC);
      await setDoc(configDoc, settings);
    } catch (error) {
      console.error("Error al actualizar configuración:", error);
      throw error;
    }
  },
};

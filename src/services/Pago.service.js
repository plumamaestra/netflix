import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  doc,
} from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";
import { ClienteService } from "./Cliente.service";
import { ServicioService } from "./Servicio.service";

const PAGOS_COLLECTION = "pagos";

export const PagoService = {
  /**
   * Obtener todos los pagos
   */
  getPayments: async () => {
    const pagosCol = collection(firestore, PAGOS_COLLECTION);
    const pagosSnapshot = await getDocs(pagosCol);
    const pagosList = pagosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return pagosList;
  },

  /**
   * Agregar un nuevo pago
   */
  addPayment: async (paymentData) => {
    const pagosCol = collection(firestore, PAGOS_COLLECTION);

    // Obtener detalles del servicio para establecer la fecha de pago
    let servicio;
    if (typeof paymentData.servicioId === "string") {
      servicio = await ServicioService.getServiceById(paymentData.servicioId);
    } else if (paymentData.servicioId?.id) {
      servicio = await ServicioService.getServiceById(paymentData.servicioId.id);
    }

    if (!servicio || !servicio.proximaFechaPago) {
      throw new Error(
        `No se pudo encontrar el servicio o la próxima fecha de pago no está definida para el servicioId: ${paymentData.servicioId}`
      );
    }

    const payment = {
      ...paymentData,
      fechaCreacion: new Date().toISOString(),
      fechaPago: servicio.proximaFechaPago, // Establecer fechaPago como la del servicio
      servicioId: doc(firestore, "servicios", paymentData.servicioId), // Convertir a referencia
    };

    const docRef = await addDoc(pagosCol, payment);
    return { id: docRef.id, ...payment };
  },

  /**
   * Actualizar un pago existente
   */
  updatePayment: async (id, updatedPayment) => {
    const pagoDoc = doc(firestore, PAGOS_COLLECTION, id);

    // Obtener el documento actual para comparar cambios
    const currentPagoSnapshot = await getDoc(pagoDoc);
    if (!currentPagoSnapshot.exists()) {
      throw new Error("Pago no encontrado");
    }
    const currentPago = currentPagoSnapshot.data();

    // Detectar si el estado cambia a 'Pagado'
    const isNowPagado =
      updatedPayment.estado === "Pagado" && currentPago.estado !== "Pagado";

    // Si se actualiza el servicioId y es una cadena, convertir a referencia
    if (updatedPayment.servicioId && typeof updatedPayment.servicioId === "string") {
      updatedPayment.servicioId = doc(
        firestore,
        "servicios",
        updatedPayment.servicioId
      );
    }

    await updateDoc(pagoDoc, updatedPayment);

    if (isNowPagado) {
      const fechaPago = new Date(updatedPayment.fechaPago);
      const numeroMeses = updatedPayment.numeroMeses || 1;

      // Calcular la nueva fecha de pago
      const nuevaFechaPago = new Date(
        fechaPago.setMonth(fechaPago.getMonth() + numeroMeses)
      );
      const formattedFechaPago = nuevaFechaPago.toISOString().split("T")[0];

      // Actualizar la próxima fecha de pago del cliente
      const clienteDocRef = doc(firestore, "clientes", updatedPayment.clienteId);
      if (clienteDocRef) {
        await updateDoc(clienteDocRef, { proximaFechaPago: formattedFechaPago });
      }
    }

    return { id, ...updatedPayment };
  },

  /**
   * Eliminar un pago
   */
  deletePayment: async (id) => {
    const pagoDoc = doc(firestore, PAGOS_COLLECTION, id);
    await deleteDoc(pagoDoc);
  },

  /**
   * Obtener pagos de un cliente
   */
  getPaymentsByClientId: async (clienteId) => {
    const pagosCol = collection(firestore, PAGOS_COLLECTION);
    const q = query(pagosCol, where("clienteId", "==", clienteId));
    const pagosSnapshot = await getDocs(q);
    const pagosList = pagosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return pagosList;
  },

  /**
   * Generar pagos pendientes
   */ 
  generatePendingPayments: async () => {
    const clientes = await ClienteService.getClients();

    for (const cliente of clientes) {
      if (!cliente.servicios || cliente.servicios.length === 0) {
        continue;
      }

      for (const servicioRef of cliente.servicios) {
        const servicioId =
          typeof servicioRef === "string" ? servicioRef : servicioRef.id;
        const servicio = await ServicioService.getServiceById(servicioId);

        if (!servicio || !cliente.proximaFechaPago) {
          continue;
        }

        const proximaFechaPago = new Date(cliente.proximaFechaPago);
        const hoy = new Date();

        if (
          proximaFechaPago.getMonth() === hoy.getMonth() &&
          proximaFechaPago.getFullYear() === hoy.getFullYear()
        ) {
          const existingPayments = await PagoService.getPaymentsByClientId(
            cliente.id
          );

          const yaExistePagoPendiente = existingPayments.some((pago) => {
            const fechaPago = new Date(pago.fechaPago);
            return (
              pago.servicioId.id === servicioId &&
              fechaPago.getMonth() === proximaFechaPago.getMonth() &&
              fechaPago.getFullYear() === proximaFechaPago.getFullYear()
            );
          });

          if (!yaExistePagoPendiente) {
            await PagoService.addPayment({
              clienteId: cliente.id,
              clienteNombre: cliente.name,
              phone: cliente.phone,
              servicioId: servicioId,
              servicio: servicio.nombre,
              monto: parseFloat(servicio.precioMensual),
              fechaPago: proximaFechaPago.toISOString().split("T")[0],
              estado: "Pendiente",
              numeroMeses: 1,
            });
          }
        }
      }
    }
  },
};

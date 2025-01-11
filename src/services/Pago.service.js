// src/services/Pago.service.js
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, doc } from "firebase/firestore";
import { firestore } from '../firebase/firebaseConfig';
import { ClienteService } from './Cliente.service';
import { ServicioService } from './Servicio.service';

const PAGOS_COLLECTION = 'pagos';

export const PagoService = {
  /**
   * Obtener todos los pagos
   */
  getPayments: async () => {
    const pagosCol = collection(firestore, PAGOS_COLLECTION);
    const pagosSnapshot = await getDocs(pagosCol);
    const pagosList = pagosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return pagosList;
  },

  /**
   * Agregar un nuevo pago
   */
  addPayment: async (paymentData) => {
    const pagosCol = collection(firestore, PAGOS_COLLECTION);
    const payment = {
      ...paymentData,
      fechaCreacion: new Date().toISOString(),
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
      throw new Error('Pago no encontrado');
    }
    const currentPago = currentPagoSnapshot.data();

    // Detectar si el estado cambia a 'Pagado'
    const isNowPagado = updatedPayment.estado === 'Pagado' && currentPago.estado !== 'Pagado';

    // Si se actualiza el servicioId y es una cadena, convertir a referencia
    if (updatedPayment.servicioId && typeof updatedPayment.servicioId === 'string') {
      updatedPayment.servicioId = doc(firestore, "servicios", updatedPayment.servicioId);
    }

    await updateDoc(pagoDoc, updatedPayment);

    if (isNowPagado) {
      // Calcular la nueva proximaFechaPago para el cliente
      const fechaPago = new Date(updatedPayment.fechaPago);
      const numeroMeses = updatedPayment.numeroMeses || 1;

      // Sumar los meses al fechaPago
      const nuevaFechaPago = new Date(fechaPago.setMonth(fechaPago.getMonth() + numeroMeses));

      // Formatear la fecha a 'YYYY-MM-DD'
      const year = nuevaFechaPago.getFullYear();
      const month = String(nuevaFechaPago.getMonth() + 1).padStart(2, '0');
      const day = String(nuevaFechaPago.getDate()).padStart(2, '0');
      const proximaFechaPago = `${year}-${month}-${day}`;

      // Actualizar la proximaFechaPago en el cliente
      const clienteDocRef = doc(firestore, "clientes", updatedPayment.clienteId);
      if (clienteDocRef && clienteDocRef.path) {
        await updateDoc(clienteDocRef, { proximaFechaPago });
        console.log(`✅ Actualizada proximaFechaPago del cliente ${updatedPayment.clienteId} a ${proximaFechaPago}`);
      } else {
        console.warn('⚠️ clienteId no es una referencia válida.');
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
    const pagosList = pagosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return pagosList;
  },

  /**
   * Generar pagos pendientes
   */
  generatePendingPayments: async () => {
    console.log('⏳ Iniciando generación de pagos pendientes...');
    const clientes = await ClienteService.getClients();

    for (const cliente of clientes) {
      if (!cliente.servicios || cliente.servicios.length === 0) {
        console.warn(`⚠️ Cliente ${cliente.name} no tiene un servicio asignado.`);
        continue;
      }

      const servicioIds = Array.isArray(cliente.servicios)
        ? cliente.servicios.map(ref => ref.id)
        : cliente.servicios && cliente.servicios.id
        ? [cliente.servicios.id]
        : [];

      for (const servicioId of servicioIds) {
        const servicio = await ServicioService.getServiceById(servicioId);

        if (!servicio || !servicio.proximaFechaPago) {
          console.warn(`⚠️ El servicio del cliente ${cliente.name} no tiene una fecha válida.`);
          continue;
        }

        const fechaPago = new Date(servicio.proximaFechaPago);
        const hoy = new Date();
        const diferencia = Math.floor((fechaPago - hoy) / (1000 * 60 * 60 * 24));

        console.log(`🗓️ Cliente: ${cliente.name}, Días para pagar: ${diferencia}`);

        // Si faltan 3 días o menos para la fecha de pago
        if (diferencia <= 3 && diferencia >= 0) {
          console.log(`🔔 Cliente: ${cliente.name} está dentro del rango de días para pago pendiente.`);

          const existingPayments = await PagoService.getPaymentsByClientId(cliente.id);

          // Verificar si ya existe un pago completado para el cliente y servicio
          const pagoCompletado = existingPayments.some(
            (pago) => pago.fechaPago === servicio.proximaFechaPago && pago.estado === 'Pagado'
          );

          if (pagoCompletado) {
            console.log(`ℹ️ El cliente ${cliente.name} ya ha pagado la factura de ${servicio.nombre}. No se generará un pago pendiente.`);
            continue; // No generar un pago pendiente si el pago está completado
          }

          // Verificar si ya existe un pago pendiente para este cliente y servicio
          const yaExistePagoPendiente = existingPayments.some(
            (pago) => pago.fechaPago === servicio.proximaFechaPago && pago.estado === 'Pendiente'
          );

          if (!yaExistePagoPendiente) {
            console.log(`✅ Generando pago pendiente para ${cliente.name}`);

            // Agregar el pago pendiente
            await PagoService.addPayment({
              clienteId: cliente.id,
              clienteNombre: cliente.name, // Nombre del cliente
              servicioId: servicio.id, // ID del servicio (se convertirá a referencia en addPayment)
              servicio: servicio.nombre,  // Nombre del servicio
              monto: parseFloat(servicio.precioMensual),  // Monto del servicio
              fechaPago: servicio.proximaFechaPago,
              estado: 'Pendiente',
              numeroMeses: 1, // Por defecto 1 mes
            });
          } else {
            console.log(`ℹ️ Ya existe un pago pendiente para ${cliente.name}`);
          }
        }
      }
    }

    console.log('✅ Finalizó la generación de pagos pendientes.');
    // Actualizar el estado de los clientes si es necesario
    await PagoService.updateClientStatus();
  },

  /**
   * Actualizar el estado de los clientes basado en los pagos pendientes
   * - Si un cliente tiene 2 o más pagos pendientes, se marcará como 'Inactivo'
   */
  updateClientStatus: async () => {
    console.log('⏳ Actualizando estado de los clientes...');
    const clientes = await ClienteService.getClients();

    for (const cliente of clientes) {
      const pagosPendientes = (await PagoService.getPaymentsByClientId(cliente.id)).filter(
        (pago) => pago.estado === 'Pendiente'
      );

      if (pagosPendientes.length >= 2) {
        console.warn(`⚠️ Cliente ${cliente.name} ha sido marcado como Inactivo por pagos pendientes.`);
        await ClienteService.updateClient(cliente.id, { estado: 'Inactivo' });
      }
    }

    console.log('✅ Estados de clientes actualizados correctamente.');
  },
};

// Exponer PagoService en la consola para pruebas manuales (opcional)
if (typeof window !== 'undefined') {
  window.PagoService = PagoService;
}

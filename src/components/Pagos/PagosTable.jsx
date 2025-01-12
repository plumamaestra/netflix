import React, { useState, useEffect } from 'react';
import { Edit, Trash2, MessageCircle } from 'lucide-react';
import WhatsAppModal from '../WhatsApp/WhatsAppModal';
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../../firebase/firebaseConfig';

const PagosTable = ({ payments = [], plantillas = [], onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [error, setError] = useState('');
  const [serviceCache, setServiceCache] = useState({}); // Cache para evitar múltiples llamadas

  /**
   * Función para abrir el modal de WhatsApp con los datos del pago seleccionado
   */
  const handleWhatsAppModalOpen = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  /**
   * Función para eliminar un pago
   */
  const handleDeletePayment = async (paymentId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este pago?');
    if (!confirmDelete) return;

    try {
      await onDelete(paymentId);
    } catch (err) {
      console.error('Error al eliminar el pago:', err);
      setError('No se pudo eliminar el pago.');
    }
  };

  /**
   * Función para editar un pago
   */
  const handleEditPayment = async (payment) => {
    try {
      await onEdit(payment);
    } catch (err) {
      console.error('Error al editar el pago:', err);
      setError('No se pudo editar el pago.');
    }
  };

  /**
   * Función para formatear fechas
   */
  const formatFecha = (fecha) => {
    if (!fecha) return 'N/A';
  
    // Manejar fecha como cadena (ISO string)
    if (typeof fecha === 'string') {
      const date = new Date(fecha + 'T00:00:00'); // Asegurar el formato de fecha local
      return date.toLocaleDateString();
    }
  
    return 'N/A';
  };
  
  /**
   * Obtener el nombre del servicio basado en servicioId (Referencia)
   */
  const getServiceName = async (servicioRef) => {
    if (!servicioRef) return 'Sin servicio';

    let servicioId;
    if (typeof servicioRef === 'string') {
      // Caso en que servicioRef es una cadena (referencia como /servicios/{id})
      const parts = servicioRef.split('/');
      servicioId = parts[parts.length - 1];
    } else if (servicioRef.id) {
      // Caso en que servicioRef es una referencia Firestore
      servicioId = servicioRef.id;
    } else {
      return 'Servicio desconocido';
    }

    // Verificar si ya está en el cache
    if (serviceCache[servicioId]) {
      return serviceCache[servicioId];
    }

    try {
      const servicioDoc = await getDoc(doc(firestore, 'servicios', servicioId));
      if (servicioDoc.exists()) {
        const nombre = servicioDoc.data().nombre;
        setServiceCache((prev) => ({ ...prev, [servicioId]: nombre }));
        return nombre;
      } else {
        return 'Servicio no encontrado';
      }
    } catch (err) {
      console.error('Error al obtener el servicio:', err);
      return 'Error al obtener servicio';
    }
  };

  // Renderizar pagos con nombres de servicios
  const [paymentsWithServiceNames, setPaymentsWithServiceNames] = useState([]);

  useEffect(() => {
    const fetchServiceNames = async () => {
      const updatedPayments = await Promise.all(
        payments.map(async (payment) => {
          const servicioNombre = payment.servicio
            ? payment.servicio // Usar el nombre del servicio directamente si está disponible
            : await getServiceName(payment.servicioId); // Obtenerlo desde la referencia
          return { ...payment, servicioNombre };
        })
      );
      setPaymentsWithServiceNames(updatedPayments);
    };

    if (payments.length > 0) {
      fetchServiceNames();
    } else {
      setPaymentsWithServiceNames([]);
    }
  }, [payments]);

  /**
   * Filtrar plantillas para excluir aquellas con tipo === 'Nuevo Cliente'
   */
  const filteredPlantillas = plantillas.filter((plantilla) => plantilla.tipo !== 'Nuevo Cliente');

  return (
    <>
      <div className="bg-white shadow rounded-lg">
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Servicio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Meses
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paymentsWithServiceNames.length > 0 ? (
              paymentsWithServiceNames.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.clienteNombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.servicioNombre || 'Cargando...'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${payment.monto}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.numeroMeses || 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.fechaPago ? formatFecha(payment.fechaPago) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        payment.estado === 'Pagado'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {payment.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditPayment(payment)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeletePayment(payment.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleWhatsAppModalOpen(payment)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <MessageCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No hay pagos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de WhatsApp */}
      {isModalOpen && selectedPayment && (
        <WhatsAppModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          payment={selectedPayment} // Ahora 'payment' contiene los campos necesarios para enviar el mensaje
          plantillas={filteredPlantillas} // Pasar plantillas filtradas (excluyendo 'Nuevo Cliente')
        />
      )}
    </>
  );
};

export default PagosTable;

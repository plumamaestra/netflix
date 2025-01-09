import React, { useState, useEffect } from 'react';
import { PagoService } from '../services/Pago.service';
import { PlantillaService } from '../services/Plantilla.service';
import PagosTable from '../components/Pagos/PagosTable';
import AddPagoModal from '../components/Pagos/AddPagoModal';

const Pagos = () => {
  const [payments, setPayments] = useState([]);
  const [plantillas, setPlantillas] = useState([]); // Estado para almacenar las plantillas
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  /**
   * Cargar pagos y plantillas al inicio
   */
  useEffect(() => {
    // Generar pagos pendientes y actualizar estado de clientes al cargar la página
    PagoService.generatePendingPayments();
    setPayments(PagoService.getPayments());

    // Cargar las plantillas
    setPlantillas(PlantillaService.getPlantillas());
  }, []);

  /**
   * Guardar un nuevo pago o actualizar uno existente
   */
  const handleSave = (payment) => {
    if (editingPayment) {
      // Actualizar pago existente
      PagoService.updatePayment(payment.id, payment);
    } else {
      // Agregar nuevo pago
      PagoService.addPayment(payment);
    }

    setPayments(PagoService.getPayments());
    setModalOpen(false);
    setEditingPayment(null);
  };

  /**
   * Eliminar un pago
   */
  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de eliminar este pago?')) {
      PagoService.deletePayment(id);
      setPayments(PagoService.getPayments());
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Encabezado */}
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">💵 Pagos</h1>
        <button
          onClick={() => {
            setEditingPayment(null);
            setModalOpen(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          + Registrar Pago
        </button>
      </div>

      {/* Tabla de Pagos */}
      <PagosTable
        payments={payments}
        plantillas={plantillas} // Pasar plantillas al componente PagosTable
        onEdit={(payment) => {
          setEditingPayment(payment);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      {/* Modal de Pagos */}
      <AddPagoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingPayment}
      />
    </div>
  );
};

export default Pagos;

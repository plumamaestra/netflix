// src/pages/Pagos.jsx
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Cargar pagos y plantillas al inicio
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await PagoService.generatePendingPayments();
        const fetchedPayments = await PagoService.getPayments();
        setPayments(fetchedPayments);

        const fetchedPlantillas = await PlantillaService.getPlantillas();
        setPlantillas(fetchedPlantillas);
      } catch (err) {
        setError('No se pudieron cargar los pagos o plantillas.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Guardar un nuevo pago o actualizar uno existente
   */
  const handleSave = async (payment) => {
    try {
      if (editingPayment) {
        // Actualizar pago existente
        await PagoService.updatePayment(editingPayment.id, payment);
        const updatedPayments = await PagoService.getPayments();
        setPayments(updatedPayments);
      } else {
        // Agregar nuevo pago
        await PagoService.addPayment(payment);
        const updatedPayments = await PagoService.getPayments();
        setPayments(updatedPayments);
      }
      setModalOpen(false);
      setEditingPayment(null);
    } catch (err) {
      setError('No se pudo guardar el pago.');
    }
  };

  /**
   * Eliminar un pago
   */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de eliminar este pago?');
    if (!confirmDelete) return;

    try {
      await PagoService.deletePayment(id);
      const updatedPayments = await PagoService.getPayments();
      setPayments(updatedPayments);
    } catch (err) {
      setError('No se pudo eliminar el pago.');
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-700">Cargando pagos...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Mensaje de Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

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

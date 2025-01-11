// src/pages/PlantillasPage.jsx
import React, { useState, useEffect } from 'react';
import PlantillasTable from '../components/Plantillas/PlantillasTable';
import AddPlantillaModal from '../components/Plantillas/AddPlantillaModal';
import { PlantillaService } from '../services/Plantilla.service';

const Plantillas = () => {
  const [plantillas, setPlantillas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlantilla, setEditingPlantilla] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Obtener todas las plantillas al montar el componente
   */
  useEffect(() => {
    const fetchPlantillas = async () => {
      setLoading(true);
      try {
        const plantillasData = await PlantillaService.getPlantillas();
        setPlantillas(plantillasData);
      } catch (err) {
        console.error("Error al obtener plantillas:", err);
        setError("No se pudieron cargar las plantillas. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlantillas();
  }, []);

  /**
   * Función para guardar una plantilla (agregar o actualizar)
   */
  const handleSave = async (plantilla) => {
    setLoading(true);
    try {
      if (editingPlantilla) {
        // Actualizar plantilla existente
        const updatedPlantilla = await PlantillaService.updatePlantilla(editingPlantilla.id, plantilla);
        setPlantillas(prev =>
          prev.map(p => (p.id === updatedPlantilla.id ? updatedPlantilla : p))
        );
      } else {
        // Agregar nueva plantilla
        const newPlantilla = await PlantillaService.addPlantilla(plantilla);
        setPlantillas(prev => [...prev, newPlantilla]);
      }
      setModalOpen(false);
      setEditingPlantilla(null);
      setError('');
    } catch (err) {
      console.error("Error al guardar la plantilla:", err);
      setError("Ocurrió un error al guardar la plantilla. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Función para editar una plantilla
   */
  const handleEdit = (plantilla) => {
    setEditingPlantilla(plantilla);
    setModalOpen(true);
  };

  /**
   * Función para eliminar una plantilla
   */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de eliminar esta plantilla?');
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await PlantillaService.deletePlantilla(id);
      setPlantillas(prev => prev.filter(p => p.id !== id));
      setError('');
    } catch (err) {
      console.error("Error al eliminar la plantilla:", err);
      setError("Ocurrió un error al eliminar la plantilla. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Función para recargar plantillas (por ejemplo, después de una actualización externa)
   */
  const reloadPlantillas = async () => {
    setLoading(true);
    try {
      const plantillasData = await PlantillaService.getPlantillas();
      setPlantillas(plantillasData);
      setError('');
    } catch (err) {
      console.error("Error al recargar plantillas:", err);
      setError("No se pudieron recargar las plantillas. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Plantillas de Mensajes</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          + Agregar Plantilla
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-700 mb-4">Cargando...</p>}

      <PlantillasTable
        plantillas={plantillas}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddPlantillaModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingPlantilla(null);
          setError('');
        }}
        onSave={handleSave}
        initialData={editingPlantilla} // Enviar los datos de la plantilla a editar
      />
    </div>
  );
};

export default Plantillas;

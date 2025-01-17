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

  useEffect(() => {
    const fetchPlantillas = async () => {
      setLoading(true);
      try {
        const plantillasData = await PlantillaService.getPlantillas();
        setPlantillas(plantillasData);
      } catch (err) {
        setError('No se pudieron cargar las plantillas. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlantillas();
  }, []);

  const handleSave = async (plantilla) => {
    setLoading(true);
    try {
      if (editingPlantilla) {
        const updatedPlantilla = await PlantillaService.updatePlantilla(editingPlantilla.id, plantilla);
        setPlantillas(prev =>
          prev.map(p => (p.id === updatedPlantilla.id ? updatedPlantilla : p))
        );
      } else {
        const newPlantilla = await PlantillaService.addPlantilla(plantilla);
        setPlantillas(prev => [...prev, newPlantilla]);
      }
      setModalOpen(false);
      setEditingPlantilla(null);
      setError('');
    } catch (err) {
      setError('Ocurrió un error al guardar la plantilla. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plantilla) => {
    setEditingPlantilla(plantilla);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de eliminar esta plantilla?');
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await PlantillaService.deletePlantilla(id);
      setPlantillas(prev => prev.filter(p => p.id !== id));
      setError('');
    } catch (err) {
      setError('Ocurrió un error al eliminar la plantilla. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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
        initialData={editingPlantilla}
      />
    </div>
  );
};

export default Plantillas;

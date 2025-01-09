import React, { useState } from 'react';
import PlantillasTable from '../components/Plantillas/PlantillasTable';
import AddPlantillaModal from '../components/Plantillas/AddPlantillaModal';
import { PlantillaService } from '../services/Plantilla.service';

const Plantillas = () => {
  const [plantillas, setPlantillas] = useState(PlantillaService.getPlantillas());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlantilla, setEditingPlantilla] = useState(null);

  // Función para guardar una plantilla
  const handleSave = (plantilla) => {
    if (editingPlantilla) {
      // Actualizar plantilla existente
      PlantillaService.updatePlantilla(plantilla.id, plantilla);
    } else {
      // Agregar nueva plantilla
      PlantillaService.addPlantilla(plantilla);
    }

    setPlantillas(PlantillaService.getPlantillas()); // Actualizar el estado con las plantillas guardadas
    setModalOpen(false);
    setEditingPlantilla(null);
  };

  // Función para editar una plantilla
  const handleEdit = (plantilla) => {
    setEditingPlantilla(plantilla);
    setModalOpen(true);
  };

  // Función para eliminar una plantilla
  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de eliminar esta plantilla?')) {
      PlantillaService.deletePlantilla(id);
      setPlantillas(PlantillaService.getPlantillas());
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

      <PlantillasTable
        plantillas={plantillas}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddPlantillaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingPlantilla} // Enviar los datos de la plantilla a editar
      />
    </div>
  );
};

export default Plantillas;

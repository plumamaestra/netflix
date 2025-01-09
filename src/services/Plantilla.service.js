const PLANTILLAS_KEY = "plantillas";

export const PlantillaService = {
  // Obtener todas las plantillas
  getPlantillas: () => {
    const plantillas = JSON.parse(localStorage.getItem(PLANTILLAS_KEY));
    console.log("Plantillas recuperadas: ", plantillas); // Verificamos qué se está recuperando
    return plantillas || [];
  },

  // Agregar una nueva plantilla
  addPlantilla: (plantilla) => {
    const plantillas = PlantillaService.getPlantillas();
    plantilla.id = Date.now().toString(); // Asignamos un ID único

    plantillas.push(plantilla); // Agregamos la plantilla al array

    // Guardamos las plantillas actualizadas en localStorage
    try {
      localStorage.setItem(PLANTILLAS_KEY, JSON.stringify(plantillas));
      console.log("Plantilla agregada correctamente: ", plantilla);
    } catch (error) {
      console.error("Error al guardar la plantilla en localStorage", error);
    }
  },

  // Actualizar plantilla
  updatePlantilla: (id, updatedPlantilla) => {
    const plantillas = PlantillaService.getPlantillas().map((plantilla) =>
      plantilla.id === id ? { ...plantilla, ...updatedPlantilla } : plantilla
    );

    // Guardamos las plantillas actualizadas en localStorage
    try {
      localStorage.setItem(PLANTILLAS_KEY, JSON.stringify(plantillas));
      console.log("Plantilla actualizada correctamente: ", updatedPlantilla);
    } catch (error) {
      console.error("Error al actualizar la plantilla en localStorage", error);
    }
  },

  // Eliminar plantilla
  deletePlantilla: (id) => {
    const plantillas = PlantillaService.getPlantillas().filter(
      (plantilla) => plantilla.id !== id
    );

    // Guardamos las plantillas después de eliminar una
    try {
      localStorage.setItem(PLANTILLAS_KEY, JSON.stringify(plantillas));
      console.log("Plantilla eliminada con id: ", id);
    } catch (error) {
      console.error("Error al eliminar la plantilla en localStorage", error);
    }
  },
};

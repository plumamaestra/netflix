import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns'; // Importar funciones de date-fns
import { ServicioService } from '../../services/Servicio.service';
import WhatsAppModal from '../WhatsApp/WhatsAppModal';
import { MessageCircle } from 'lucide-react';
import { DocumentReference } from 'firebase/firestore'; // Importa DocumentReference si usas TypeScript

const ClientesTable = ({ clients, onEdit, onDelete, plantillas = [] }) => { 
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  /**
   * Cargar servicios disponibles al montar el componente
   */
  useEffect(() => {
    const fetchServicios = async () => {
      setLoading(true);
      try {
        const servicios = await ServicioService.getServices();
        setServiciosDisponibles(servicios);
      } catch (err) {
        console.error('Error al cargar los servicios:', err);
        setError('No se pudieron cargar los servicios disponibles.');
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();
  }, []);

  /**
   * Obtener nombre de servicio por referencia o ID
   */
  const getServiceName = (servicio) => {
    if (!servicio) return 'Sin servicios';
    let servicioId;

    // Si 'servicio' es una referencia, extraer el ID
    if (servicio instanceof DocumentReference) {
      servicioId = servicio.id;
    } else if (typeof servicio === 'string') { // Si 'servicio' es una cadena de texto (ID)
      servicioId = servicio;
    } else {
      return 'Servicio desconocido';
    }

    const servicioEncontrado = serviciosDisponibles.find((s) => s.id === servicioId);
    return servicioEncontrado ? servicioEncontrado.nombre : 'Servicio desconocido';
  };

  /**
   * Formatear la fecha en formato Día/Mes/Año con el mes en letras
   */
  const formatDate = (date) => {
    const months = [
      'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 
      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];
    const d = parseISO(date); // Asegurarse de que la fecha se parse correctamente
    const day = d.getDate().toString().padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  /**
   * Abrir el modal de WhatsApp con los datos del cliente
   */
  const handleWhatsAppModalOpen = (client) => {
    // Crear un objeto con los campos necesarios para la plantilla "NuevoCliente"
    const clientForTemplate = {
      clienteNombre: client.name,
      servicio: client.servicios && client.servicios.length > 0 ? getServiceName(client.servicios[0]) : 'Sin servicio',
      fechaRegistro: client.fechaRegistro,
      proximaFechaPago: client.proximaFechaPago,
      phone: client.phone, // Asegúrate de que el cliente tiene el campo 'phone'
    };
    setSelectedClient(clientForTemplate);
    setIsModalOpen(true);
  };

  if (loading) {
    return <p>Cargando servicios...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-4">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Teléfono</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Servicios</th>
              <th className="px-4 py-2">Próxima Fecha de Pago</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.length > 0 ? (
              clients.map((client) => (
                <tr key={client.id} className="border-b hover:bg-gray-50">
                  {/* Nombre del Cliente */}
                  <td className="px-4 py-2">{client.name}</td>

                  {/* Teléfono del Cliente */}
                  <td className="px-4 py-2">{client.phone}</td>

                  {/* Estado del Cliente */}
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-md ${client.estado === 'Activo'
                          ? 'bg-green-200 text-green-700'
                          : 'bg-red-200 text-red-700'
                        }`}
                    >
                      {client.estado}
                    </span>
                  </td>

                  {/* Servicios del Cliente */}
                  <td className="px-4 py-2">
                    {Array.isArray(client.servicios) && client.servicios.length > 0 ? (
                      <div className="flex flex-wrap">
                        {client.servicios.map((servicio, index) => (
                          <span
                            key={servicio.id || index}
                            className="bg-blue-200 text-blue-700 px-2 py-1 m-1 rounded-md"
                          >
                            {getServiceName(servicio)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md">Sin servicios</span>
                    )}
                  </td>

                  {/* Próxima Fecha de Pago */}
                  <td className="px-4 py-2">{client.proximaFechaPago ? formatDate(client.proximaFechaPago) : 'N/A'}</td>

                  {/* Acciones */}
                  <td className="px-4 py-2 flex items-center space-x-2">
                    <button onClick={() => onEdit(client)} className="text-blue-500">
                      Editar
                    </button>
                    <button onClick={() => onDelete(client.id)} className="text-red-500">
                      Eliminar
                    </button>
                    <button
                      onClick={() => handleWhatsAppModalOpen(client)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No hay clientes disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de WhatsApp */}
      {isModalOpen && (
        <WhatsAppModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          payment={selectedClient} // Reutilizamos el objeto cliente como payment
          plantillas={plantillas.filter((plantilla) => plantilla.tipo === 'Nuevo Cliente')} // Filtramos solo "NuevoCliente"
        />
      )}
    </>
  );
};

export default ClientesTable;

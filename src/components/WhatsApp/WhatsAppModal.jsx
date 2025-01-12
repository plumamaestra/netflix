// src/components/WhatsAppModal.jsx
import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Send } from 'lucide-react';

// Función para formatear fechas
// Función para formatear fechas
const formatFecha = (fecha) => {
  if (!fecha) return 'Fecha No Definida';

  // Manejar fecha como cadena (ISO string)
  if (typeof fecha === 'string') {
    const date = new Date(fecha + 'T00:00:00'); // Asegurar que se maneje como fecha local
    return date.toLocaleDateString(); // Mostrar en formato local
  }

  return 'Fecha No Definida';
};


// Función para reemplazar los placeholders
const processTemplate = (template, clientData) => {
  const placeholders = {
    '{{clienteNombre}}': clientData.clienteNombre || 'Cliente No Definido',
    '{{servicio}}': clientData.servicio || 'Servicio No Definido',
    '{{fechaRegistro}}': formatFecha(clientData.fechaRegistro), // Formatear fecha
    '{{proximaFechaPago}}': formatFecha(clientData.proximaFechaPago), // Formatear fecha
    '{{fechaPago}}': formatFecha(clientData.fechaPago), // Formatear fecha
    '{{monto}}': clientData.monto || 'Monto No Definido',
  };

  return Object.entries(placeholders).reduce(
    (text, [key, value]) => text.replace(new RegExp(key, 'g'), value),
    template
  );
};

const WhatsAppModal = ({ isOpen, onClose, payment, plantillas }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [messagePreview, setMessagePreview] = useState('');

  useEffect(() => {
    // Resetear valores al abrir o cerrar el modal
    if (!isOpen) {
      setSelectedTemplate('');
      setMessagePreview('');
    }
  }, [isOpen]);

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);

    const template = plantillas.find((t) => t.id === templateId);
    if (template) {
      const clientData = {
        clienteNombre: payment.clienteNombre,
        servicio: payment.servicio,
        fechaRegistro: payment.fechaRegistro,
        proximaFechaPago: payment.proximaFechaPago,
        fechaPago: payment.fechaPago,
        monto: payment.monto,
      };
      const message = processTemplate(template.contenido, clientData);
      setMessagePreview(message);
    } else {
      setMessagePreview('');
    }
  };

  const handleWhatsAppClick = (clienteTelefono, mensaje) => {
    const formattedMessage = encodeURIComponent(mensaje);
    window.open(`https://wa.me/${clienteTelefono}?text=${formattedMessage}`, '_blank');
    onClose();
  };

  const handleSendTemplate = () => {
    if (!selectedTemplate) {
      alert('Por favor, selecciona una plantilla.');
      return;
    }
    handleWhatsAppClick(payment.phone, messagePreview);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">Enviar mensaje de WhatsApp</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Seleccionar plantilla
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Elegir plantilla...</option>
              {plantillas.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.tipo}
                </option>
              ))}
            </select>
          </div>

          {messagePreview && (
            <div className="p-2 bg-gray-100 rounded-md border text-sm">
              <p className="font-semibold text-gray-700">Vista previa:</p>
              <p>{messagePreview}</p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button
              onClick={() => handleWhatsAppClick(payment.phone, '¡Hola! Tengo una consulta.')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-md"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Mensaje rápido
            </button>

            {selectedTemplate && (
              <button
                onClick={handleSendTemplate}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar plantilla
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppModal;

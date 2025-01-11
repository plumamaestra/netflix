// src/models/Cliente.model.js

class Cliente {
  constructor({ name, phone, estado, servicios, fechaCreacion, fechaRegistro, proximaFechaPago }) {
    this.name = name;
    this.phone = phone;
    this.estado = estado;
    this.servicios = servicios; // Este campo ahora será un array de referencias
    this.fechaCreacion = fechaCreacion;
    this.fechaRegistro = fechaRegistro;
    this.proximaFechaPago = proximaFechaPago;
  }

  validate() {
    if (!this.name) throw new Error("El nombre es obligatorio.");
    if (!this.phone) throw new Error("El teléfono es obligatorio.");
    if (!this.estado) throw new Error("El estado es obligatorio.");
    if (!this.proximaFechaPago) throw new Error("La próxima fecha de pago es obligatoria.");
    // Añade más validaciones según sea necesario
  }
}

export default Cliente;

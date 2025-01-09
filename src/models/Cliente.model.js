import Parent from './parent.model';

export default class Cliente extends Parent {
  constructor({ name, phone, fechaRegistro, estado, servicios, proximaFechaPago }) {
    super();
    this.name = name || '';
    this.phone = phone || '';
    this.fechaRegistro = fechaRegistro || new Date().toLocaleDateString();
    this.estado = estado || 'Activo'; // Activo por defecto
    this.servicios = servicios || []; // Array de servicios contratados
    this.proximaFechaPago = proximaFechaPago || '';
  }

  validate() {
    if (!this.name) throw new Error('El nombre es obligatorio');
    if (!this.phone) throw new Error('El teléfono es obligatorio');
    if (!/^\d{10}$/.test(this.phone)) throw new Error('El teléfono debe tener 10 dígitos');
    if (!this.proximaFechaPago) throw new Error('La próxima fecha de pago es obligatoria');
  }
}

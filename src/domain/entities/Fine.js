/**
 * Entidad Fine (Multa)
 * Representa una multa de tránsito asociada a un vehículo
 */

export const FINE_STATUS = {
  PENDING: 'pendiente',
  PAID: 'pagada',
  APPEALED: 'apelada',
  CANCELLED: 'anulada',
  OVERDUE: 'vencida',
};

export const FINE_TYPES = {
  SPEED: 'Exceso de velocidad',
  RED_LIGHT: 'Semáforo en rojo',
  PARKING: 'Estacionamiento indebido',
  NO_LICENSE: 'Sin licencia de conducir',
  NO_SEATBELT: 'Sin cinturón de seguridad',
  DUI: 'Conducción bajo influencia',
  WRONG_WAY: 'Circulación en sentido contrario',
  NO_INSURANCE: 'Sin seguro vehicular',
  EXPIRED_PLATES: 'Placas vencidas',
  RECKLESS: 'Conducción temeraria',
};

export class Fine {
  constructor({ id, vehiculoPlaca, tipo, descripcion, monto, fecha, estado, puntoInfraccion, agente, fechaVencimiento }) {
    this.id = id;
    this.vehiculoPlaca = vehiculoPlaca;
    this.tipo = tipo;
    this.descripcion = descripcion;
    this.monto = monto;
    this.fecha = fecha;
    this.estado = estado || FINE_STATUS.PENDING;
    this.puntoInfraccion = puntoInfraccion;
    this.agente = agente;
    this.fechaVencimiento = fechaVencimiento;
  }

  get isPending() {
    return this.estado === FINE_STATUS.PENDING || this.estado === FINE_STATUS.OVERDUE;
  }

  get isPayable() {
    return this.estado === FINE_STATUS.PENDING || this.estado === FINE_STATUS.OVERDUE;
  }

  get isAppealable() {
    return this.estado === FINE_STATUS.PENDING;
  }

  static fromJSON(json) {
    return new Fine(json);
  }
}

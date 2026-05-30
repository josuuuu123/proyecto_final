/**
 * Entidad Payment (Pago)
 * Representa un pago realizado para una multa
 */

export const PAYMENT_STATUS = {
  PENDING: 'procesando',
  COMPLETED: 'completado',
  FAILED: 'fallido',
  REFUNDED: 'reembolsado',
};

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'Tarjeta de Crédito',
  DEBIT_CARD: 'Tarjeta de Débito',
  BANK_TRANSFER: 'Transferencia Bancaria',
  PAYPAL: 'PayPal',
};

export class Payment {
  constructor({ id, multaId, monto, metodo, referencia, fecha, estado, titular, ultimos4Digitos }) {
    this.id = id;
    this.multaId = multaId;
    this.monto = monto;
    this.metodo = metodo;
    this.referencia = referencia;
    this.fecha = fecha;
    this.estado = estado || PAYMENT_STATUS.PENDING;
    this.titular = titular;
    this.ultimos4Digitos = ultimos4Digitos;
  }

  get isCompleted() {
    return this.estado === PAYMENT_STATUS.COMPLETED;
  }

  static fromJSON(json) {
    return new Payment(json);
  }
}

/**
 * Entidad Appeal (Apelación)
 * Representa una apelación a una multa de tránsito
 */

export const APPEAL_STATUS = {
  DRAFT: 'borrador',
  SUBMITTED: 'enviada',
  IN_REVIEW: 'en_revision',
  APPROVED: 'aprobada',
  REJECTED: 'rechazada',
};

export class Appeal {
  constructor({ id, multaId, cedula, motivo, descripcion, documentos, estado, fechaCreacion, fechaRespuesta, respuesta }) {
    this.id = id;
    this.multaId = multaId;
    this.cedula = cedula;
    this.motivo = motivo;
    this.descripcion = descripcion;
    this.documentos = documentos || [];
    this.estado = estado || APPEAL_STATUS.DRAFT;
    this.fechaCreacion = fechaCreacion;
    this.fechaRespuesta = fechaRespuesta;
    this.respuesta = respuesta;
  }

  get isResolved() {
    return this.estado === APPEAL_STATUS.APPROVED || this.estado === APPEAL_STATUS.REJECTED;
  }

  get isPending() {
    return this.estado === APPEAL_STATUS.SUBMITTED || this.estado === APPEAL_STATUS.IN_REVIEW;
  }

  static fromJSON(json) {
    return new Appeal(json);
  }
}

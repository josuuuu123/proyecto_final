/**
 * Entidad Owner (Propietario)
 * Representa al dueño de uno o más vehículos
 */
export class Owner {
  constructor({ cedula, nombre, apellido, email, telefono, direccion }) {
    this.cedula = cedula;
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.telefono = telefono;
    this.direccion = direccion;
  }

  get nombreCompleto() {
    return `${this.nombre} ${this.apellido}`;
  }

  static fromJSON(json) {
    return new Owner(json);
  }
}

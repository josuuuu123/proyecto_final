/**
 * Entidad Vehicle (Vehículo)
 * Representa un vehículo registrado en el sistema
 */
export class Vehicle {
  constructor({ placa, marca, modelo, anio, color, tipo, propietarioCedula, estado }) {
    this.placa = placa;
    this.marca = marca;
    this.modelo = modelo;
    this.anio = anio;
    this.color = color;
    this.tipo = tipo;
    this.propietarioCedula = propietarioCedula;
    this.estado = estado || 'activo';
  }

  get descripcion() {
    return `${this.marca} ${this.modelo} ${this.anio} - ${this.color}`;
  }

  static fromJSON(json) {
    return new Vehicle(json);
  }
}

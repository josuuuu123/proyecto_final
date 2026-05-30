/**
 * Entidad User (Usuario)
 * Representa al usuario autenticado en el sistema
 */

export const ROLES = {
  GUEST: 'GUEST',
  ADMIN: 'ADMIN',
  CLIENT: 'CLIENT'
};

export class User {
  constructor({ id, username, nombre, rol, cedula = null }) {
    this.id = id;
    this.username = username;
    this.nombre = nombre;
    this.rol = rol;
    this.cedula = cedula; // Solo para rol CLIENT
  }

  isGuest() {
    return this.rol === ROLES.GUEST;
  }

  isAdmin() {
    return this.rol === ROLES.ADMIN;
  }

  isClient() {
    return this.rol === ROLES.CLIENT;
  }
}

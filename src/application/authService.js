import { User, ROLES } from '../domain/entities/User';
import { owners } from '../infrastructure/mockData/data';

/**
 * Servicio de Autenticación simulado
 * 
 * Reglas de acceso:
 * - Usuario "admin" → Rol ADMIN
 * - Cualquier cédula (10 dígitos numéricos) → Rol CLIENT
 * - Botón "Invitado" → Rol GUEST
 */

const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

export async function login(username, password) {
  await delay();

  // Simulación Administrador
  if (username.toLowerCase() === 'admin') {
    return new User({
      id: 'A001',
      username: 'admin',
      nombre: 'Administrador de Tránsito',
      rol: ROLES.ADMIN
    });
  }

  // Simulación Policía
  if (username.toLowerCase() === 'policia' || username.toLowerCase() === 'police') {
    return new User({
      id: 'P001',
      username: username.toLowerCase(),
      nombre: 'Oficial de Policía',
      rol: ROLES.POLICE
    });
  }

  // Simulación Cliente: primero busca en datos mock, si no existe igual lo deja entrar
  const owner = owners.find(o => o.cedula === username);
  
  if (owner) {
    return new User({
      id: `C-${owner.cedula}`,
      username: owner.cedula,
      nombre: `${owner.nombre} ${owner.apellido}`,
      rol: ROLES.CLIENT,
      cedula: owner.cedula
    });
  }

  // Si no es admin ni cédula registrada, pero tiene formato de cédula (solo números), dejarlo entrar como cliente genérico
  if (/^\d{10}$/.test(username)) {
    return new User({
      id: `C-${username}`,
      username: username,
      nombre: `Ciudadano ${username}`,
      rol: ROLES.CLIENT,
      cedula: username
    });
  }

  // Si nada coincide, lanzar error
  throw new Error('Credenciales inválidas. Ingrese "admin" o un número de cédula de 10 dígitos.');
}

export function loginGuest() {
  return new User({
    id: 'GUEST-001',
    username: 'invitado',
    nombre: 'Ciudadano Invitado',
    rol: ROLES.GUEST
  });
}

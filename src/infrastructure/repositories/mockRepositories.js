/**
 * Mock Repository - Implementación simulada de los repositorios
 * Simula latencia de red con delays async
 */
import { owners, vehicles, fines, payments, appeals } from '../mockData/data';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// --- Copia mutable de los datos ---
let _fines = [...fines];
let _payments = [...payments];
let _appeals = [...appeals];

// --- Owner Repository ---
export const ownerRepository = {
  async findByCedula(cedula) {
    await delay(600);
    const owner = owners.find(o => o.cedula === cedula);
    return owner || null;
  },

  async getAll() {
    await delay(400);
    return [...owners];
  },
};

// --- Vehicle Repository ---
export const vehicleRepository = {
  async findByOwnerCedula(cedula) {
    await delay(500);
    return vehicles.filter(v => v.propietarioCedula === cedula);
  },

  async findByPlaca(placa) {
    await delay(300);
    return vehicles.find(v => v.placa === placa) || null;
  },

  async getAll() {
    await delay(400);
    return [...vehicles];
  },
};

// --- Fine Repository ---
export const fineRepository = {
  async create(fineData) {
    await delay(1000);
    const newFine = {
      ...fineData,
      id: `MUL-${String(_fines.length + 1).padStart(3, '0')}`,
      fecha: fineData.fecha || new Date().toISOString().split('T')[0],
      estado: fineData.estado || 'pendiente',
    };
    _fines.push(newFine);
    return newFine;
  },

  async findByVehiclePlaca(placa) {
    await delay(500);
    return _fines.filter(f => f.vehiculoPlaca === placa);
  },

  async findByCedula(cedula) {
    await delay(700);
    const ownerVehicles = vehicles.filter(v => v.propietarioCedula === cedula);
    const placas = ownerVehicles.map(v => v.placa);
    return _fines.filter(f => placas.includes(f.vehiculoPlaca));
  },

  async findPendingByCedula(cedula) {
    await delay(800);
    const ownerVehicles = vehicles.filter(v => v.propietarioCedula === cedula);
    const placas = ownerVehicles.map(v => v.placa);
    return _fines.filter(f => placas.includes(f.vehiculoPlaca) && (f.estado === 'pendiente' || f.estado === 'vencida'));
  },

  async findById(id) {
    await delay(300);
    return _fines.find(f => f.id === id) || null;
  },

  async getAll() {
    await delay(400);
    return [..._fines];
  },

  async updateStatus(id, status) {
    await delay(400);
    const index = _fines.findIndex(f => f.id === id);
    if (index !== -1) {
      _fines[index] = { ..._fines[index], estado: status };
      return _fines[index];
    }
    return null;
  },
};

// --- Payment Repository ---
export const paymentRepository = {
  async create(paymentData) {
    await delay(1500); // Simula procesamiento de pago
    const newPayment = {
      ...paymentData,
      id: `PAY-${String(_payments.length + 1).padStart(3, '0')}`,
      referencia: `REF-${Date.now()}`,
      fecha: new Date().toISOString().split('T')[0],
      estado: 'completado',
    };
    _payments.push(newPayment);

    // Actualizar estado de la multa
    const fineIndex = _fines.findIndex(f => f.id === paymentData.multaId);
    if (fineIndex !== -1) {
      _fines[fineIndex] = { ..._fines[fineIndex], estado: 'pagada' };
    }

    return newPayment;
  },

  async findByFineId(multaId) {
    await delay(400);
    return _payments.filter(p => p.multaId === multaId);
  },

  async getAll() {
    await delay(400);
    return [..._payments];
  },
};

// --- Appeal Repository ---
export const appealRepository = {
  async create(appealData) {
    await delay(1000);
    const newAppeal = {
      ...appealData,
      id: `APL-${String(_appeals.length + 1).padStart(3, '0')}`,
      estado: 'enviada',
      fechaCreacion: new Date().toISOString().split('T')[0],
      fechaRespuesta: null,
      respuesta: null,
    };
    _appeals.push(newAppeal);

    // Actualizar estado de la multa
    const fineIndex = _fines.findIndex(f => f.id === appealData.multaId);
    if (fineIndex !== -1) {
      _fines[fineIndex] = { ..._fines[fineIndex], estado: 'apelada' };
    }

    return newAppeal;
  },

  async findByFineId(multaId) {
    await delay(400);
    return _appeals.filter(a => a.multaId === multaId);
  },

  async findByCedula(cedula) {
    await delay(500);
    return _appeals.filter(a => a.cedula === cedula);
  },

  async findById(id) {
    await delay(300);
    return _appeals.find(a => a.id === id) || null;
  },

  async getAll() {
    await delay(400);
    return [..._appeals];
  },

  async addDocument(appealId, document) {
    await delay(800);
    const index = _appeals.findIndex(a => a.id === appealId);
    if (index !== -1) {
      _appeals[index] = {
        ..._appeals[index],
        documentos: [..._appeals[index].documentos, document],
      };
      return _appeals[index];
    }
    return null;
  },
};

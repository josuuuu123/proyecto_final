/**
 * Use Cases - Capa de Aplicación
 * Orquesta la lógica de negocio usando los repositorios
 */
import {
  ownerRepository,
  vehicleRepository,
  fineRepository,
  paymentRepository,
  appealRepository,
} from '../infrastructure/repositories/mockRepositories';

// --- Búsqueda por Cédula ---
export async function searchByCedula(cedula) {
  const owner = await ownerRepository.findByCedula(cedula);
  if (!owner) {
    return { found: false, owner: null, vehicles: [], fines: [] };
  }

  const vehicles = await vehicleRepository.findByOwnerCedula(cedula);
  const fines = await fineRepository.findByCedula(cedula);

  return { found: true, owner, vehicles, fines };
}

// --- Obtener multas de un vehículo ---
export async function getVehicleFines(placa) {
  return await fineRepository.findByVehiclePlaca(placa);
}

// --- Verificar multas pendientes ---
export async function verifyPendingFines(cedula) {
  const pendingFines = await fineRepository.findPendingByCedula(cedula);
  const totalAmount = pendingFines.reduce((sum, f) => sum + f.monto, 0);

  return {
    hasPending: pendingFines.length > 0,
    count: pendingFines.length,
    totalAmount,
    fines: pendingFines,
  };
}

// --- Procesar pago ---
export async function processPayment(fineId, paymentData) {
  const fine = await fineRepository.findById(fineId);
  if (!fine) {
    throw new Error('Multa no encontrada');
  }
  if (fine.estado === 'pagada') {
    throw new Error('Esta multa ya fue pagada');
  }

  const payment = await paymentRepository.create({
    multaId: fineId,
    monto: fine.monto,
    ...paymentData,
  });

  return payment;
}

// --- Crear apelación ---
export async function createAppeal(fineId, appealData) {
  const fine = await fineRepository.findById(fineId);
  if (!fine) {
    throw new Error('Multa no encontrada');
  }
  if (fine.estado !== 'pendiente') {
    throw new Error('Solo se pueden apelar multas pendientes');
  }

  const appeal = await appealRepository.create({
    multaId: fineId,
    ...appealData,
  });

  return appeal;
}

// --- Subir documento a apelación ---
export async function uploadAppealDocument(appealId, file) {
  const document = {
    nombre: file.name,
    tipo: file.type,
    tamanio: file.size,
    fecha: new Date().toISOString().split('T')[0],
  };

  return await appealRepository.addDocument(appealId, document);
}

// --- Dashboard stats ---
export async function getDashboardStats() {
  const allFines = await fineRepository.getAll();
  const allPayments = await paymentRepository.getAll();
  const allAppeals = await appealRepository.getAll();

  const pending = allFines.filter(f => f.estado === 'pendiente');
  const paid = allFines.filter(f => f.estado === 'pagada');
  const overdue = allFines.filter(f => f.estado === 'vencida');
  const appealed = allFines.filter(f => f.estado === 'apelada');

  return {
    totalFines: allFines.length,
    pendingFines: pending.length,
    paidFines: paid.length,
    overdueFines: overdue.length,
    appealedFines: appealed.length,
    totalPendingAmount: pending.reduce((sum, f) => sum + f.monto, 0),
    totalCollected: allPayments.reduce((sum, p) => sum + p.monto, 0),
    totalAppeals: allAppeals.length,
    recentFines: allFines.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5),
  };
}

// --- Obtener todas las multas ---
export async function getAllFines() {
  return await fineRepository.getAll();
}

// --- Obtener todos los pagos ---
export async function getAllPayments() {
  return await paymentRepository.getAll();
}

// --- Obtener todas las apelaciones ---
export async function getAllAppeals() {
  return await appealRepository.getAll();
}

// --- Obtener detalle de multa ---
export async function getFineDetail(fineId) {
  const fine = await fineRepository.findById(fineId);
  if (!fine) return null;

  const vehicle = await vehicleRepository.findByPlaca(fine.vehiculoPlaca);
  let owner = null;
  if (vehicle) {
    owner = await ownerRepository.findByCedula(vehicle.propietarioCedula);
  }
  const payments = await paymentRepository.findByFineId(fineId);
  const appeals = await appealRepository.findByFineId(fineId);

  return { fine, vehicle, owner, payments, appeals };
}

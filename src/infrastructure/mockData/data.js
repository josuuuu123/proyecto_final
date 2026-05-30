/**
 * Mock Data - Datos simulados realistas para el sistema de multas
 */

export const owners = [
  { cedula: '1712345678', nombre: 'Carlos', apellido: 'Mendoza Rivera', email: 'carlos.mendoza@email.com', telefono: '0991234567', direccion: 'Av. Amazonas N34-56, Quito' },
  { cedula: '0923456789', nombre: 'María', apellido: 'González Paredes', email: 'maria.gonzalez@email.com', telefono: '0987654321', direccion: 'Malecón 2000, Guayaquil' },
  { cedula: '0102345678', nombre: 'Juan', apellido: 'Pérez Villavicencio', email: 'juan.perez@email.com', telefono: '0976543210', direccion: 'Calle Larga 5-42, Cuenca' },
  { cedula: '1803456789', nombre: 'Ana', apellido: 'Salazar Morales', email: 'ana.salazar@email.com', telefono: '0965432109', direccion: 'Av. Cevallos y Sucre, Ambato' },
  { cedula: '1304567890', nombre: 'Roberto', apellido: 'Castro Delgado', email: 'roberto.castro@email.com', telefono: '0954321098', direccion: 'Av. 4 de Noviembre, Manta' },
  { cedula: '0605678901', nombre: 'Lucía', apellido: 'Herrera Campos', email: 'lucia.herrera@email.com', telefono: '0943210987', direccion: 'Av. Daniel León Borja, Riobamba' },
  { cedula: '1106789012', nombre: 'Fernando', apellido: 'Vásquez Rojas', email: 'fernando.vasquez@email.com', telefono: '0932109876', direccion: 'Calle Sucre y Bolívar, Loja' },
  { cedula: '0807890123', nombre: 'Patricia', apellido: 'Reyes Montaño', email: 'patricia.reyes@email.com', telefono: '0921098765', direccion: 'Av. Tsáchila, Santo Domingo' },
];

export const vehicles = [
  { placa: 'PBA-1234', marca: 'Toyota', modelo: 'Corolla', anio: 2022, color: 'Blanco', tipo: 'Sedán', propietarioCedula: '1712345678', estado: 'activo' },
  { placa: 'PBA-5678', marca: 'Chevrolet', modelo: 'Aveo', anio: 2020, color: 'Gris', tipo: 'Sedán', propietarioCedula: '1712345678', estado: 'activo' },
  { placa: 'GYE-9012', marca: 'Hyundai', modelo: 'Tucson', anio: 2023, color: 'Negro', tipo: 'SUV', propietarioCedula: '0923456789', estado: 'activo' },
  { placa: 'GYE-3456', marca: 'Kia', modelo: 'Sportage', anio: 2021, color: 'Rojo', tipo: 'SUV', propietarioCedula: '0923456789', estado: 'activo' },
  { placa: 'XBA-7890', marca: 'Nissan', modelo: 'Sentra', anio: 2019, color: 'Azul', tipo: 'Sedán', propietarioCedula: '0102345678', estado: 'activo' },
  { placa: 'TBA-1122', marca: 'Mazda', modelo: 'CX-5', anio: 2023, color: 'Plata', tipo: 'SUV', propietarioCedula: '1803456789', estado: 'activo' },
  { placa: 'MBA-3344', marca: 'Ford', modelo: 'Explorer', anio: 2022, color: 'Verde', tipo: 'SUV', propietarioCedula: '1304567890', estado: 'activo' },
  { placa: 'HBA-5566', marca: 'Volkswagen', modelo: 'Tiguan', anio: 2021, color: 'Blanco', tipo: 'SUV', propietarioCedula: '0605678901', estado: 'activo' },
  { placa: 'LBA-7788', marca: 'Renault', modelo: 'Logan', anio: 2020, color: 'Gris', tipo: 'Sedán', propietarioCedula: '1106789012', estado: 'activo' },
  { placa: 'SBA-9900', marca: 'Chevrolet', modelo: 'Tracker', anio: 2024, color: 'Naranja', tipo: 'SUV', propietarioCedula: '0807890123', estado: 'activo' },
  { placa: 'PBA-2468', marca: 'Toyota', modelo: 'Hilux', anio: 2021, color: 'Negro', tipo: 'Camioneta', propietarioCedula: '1712345678', estado: 'activo' },
];

export const fines = [
  { id: 'MLT-001', vehiculoPlaca: 'PBA-1234', tipo: 'Exceso de velocidad', descripcion: 'Exceso de velocidad en zona de 50km/h. Velocidad registrada: 78km/h', monto: 150.00, fecha: '2026-03-15', estado: 'pendiente', puntoInfraccion: 'Av. Amazonas y Naciones Unidas', agente: 'Ag. Morales #1234', fechaVencimiento: '2026-06-15' },
  { id: 'MLT-002', vehiculoPlaca: 'PBA-1234', tipo: 'Estacionamiento indebido', descripcion: 'Estacionamiento en zona prohibida señalizada', monto: 80.00, fecha: '2026-04-02', estado: 'pagada', puntoInfraccion: 'Calle Reina Victoria y Colón', agente: 'Ag. Torres #5678', fechaVencimiento: '2026-07-02' },
  { id: 'MLT-003', vehiculoPlaca: 'PBA-5678', tipo: 'Semáforo en rojo', descripcion: 'Cruce de intersección con semáforo en rojo captado por cámara', monto: 200.00, fecha: '2026-04-10', estado: 'pendiente', puntoInfraccion: 'Av. 10 de Agosto y Patria', agente: 'Cámara AT-012', fechaVencimiento: '2026-07-10' },
  { id: 'MLT-004', vehiculoPlaca: 'GYE-9012', tipo: 'Exceso de velocidad', descripcion: 'Exceso de velocidad en autopista. Velocidad registrada: 135km/h en zona de 100km/h', monto: 250.00, fecha: '2026-02-20', estado: 'apelada', puntoInfraccion: 'Autopista Guayaquil-Salinas Km 45', agente: 'Radar Fijo #RF-087', fechaVencimiento: '2026-05-20' },
  { id: 'MLT-005', vehiculoPlaca: 'GYE-3456', tipo: 'Sin cinturón de seguridad', descripcion: 'Conductor sin cinturón de seguridad en vía principal', monto: 90.00, fecha: '2026-04-18', estado: 'pendiente', puntoInfraccion: 'Av. Francisco de Orellana', agente: 'Ag. Ramírez #9012', fechaVencimiento: '2026-07-18' },
  { id: 'MLT-006', vehiculoPlaca: 'XBA-7890', tipo: 'Conducción temeraria', descripcion: 'Adelantamiento en línea continua en curva', monto: 350.00, fecha: '2026-01-05', estado: 'vencida', puntoInfraccion: 'Vía Cuenca-Azogues Km 12', agente: 'Ag. Sánchez #3456', fechaVencimiento: '2026-04-05' },
  { id: 'MLT-007', vehiculoPlaca: 'XBA-7890', tipo: 'Placas vencidas', descripcion: 'Circulación con matrícula vehicular caducada', monto: 120.00, fecha: '2026-03-28', estado: 'pendiente', puntoInfraccion: 'Av. Huayna Cápac, Cuenca', agente: 'Ag. López #7890', fechaVencimiento: '2026-06-28' },
  { id: 'MLT-008', vehiculoPlaca: 'TBA-1122', tipo: 'Estacionamiento indebido', descripcion: 'Estacionamiento en zona de carga y descarga', monto: 75.00, fecha: '2026-04-25', estado: 'pendiente', puntoInfraccion: 'Calle Bolívar y Castillo, Ambato', agente: 'Ag. Flores #2345', fechaVencimiento: '2026-07-25' },
  { id: 'MLT-009', vehiculoPlaca: 'MBA-3344', tipo: 'Exceso de velocidad', descripcion: 'Exceso de velocidad en zona escolar (30km/h). Velocidad: 55km/h', monto: 300.00, fecha: '2026-05-01', estado: 'pendiente', puntoInfraccion: 'Av. 4 de Noviembre frente a U.E. Manta', agente: 'Cámara AT-045', fechaVencimiento: '2026-08-01' },
  { id: 'MLT-010', vehiculoPlaca: 'HBA-5566', tipo: 'Semáforo en rojo', descripcion: 'Cruce peatonal con semáforo en rojo', monto: 200.00, fecha: '2026-04-12', estado: 'pagada', puntoInfraccion: 'Av. Daniel León Borja y Duchicela', agente: 'Ag. Guamán #6789', fechaVencimiento: '2026-07-12' },
  { id: 'MLT-011', vehiculoPlaca: 'LBA-7788', tipo: 'Sin seguro vehicular', descripcion: 'Circulación sin SOAT vigente', monto: 100.00, fecha: '2026-03-05', estado: 'pendiente', puntoInfraccion: 'Av. Universitaria, Loja', agente: 'Ag. Cueva #0123', fechaVencimiento: '2026-06-05' },
  { id: 'MLT-012', vehiculoPlaca: 'SBA-9900', tipo: 'Sin licencia de conducir', descripcion: 'Conductor sin portar licencia de conducir vigente', monto: 180.00, fecha: '2026-05-10', estado: 'pendiente', puntoInfraccion: 'Av. Tsáchila y Clemencia de Mora', agente: 'Ag. Andrade #4567', fechaVencimiento: '2026-08-10' },
  { id: 'MLT-013', vehiculoPlaca: 'PBA-2468', tipo: 'Exceso de velocidad', descripcion: 'Exceso de velocidad en Panamericana Norte. Velocidad: 120km/h en zona de 90km/h', monto: 200.00, fecha: '2026-05-15', estado: 'pendiente', puntoInfraccion: 'Panamericana Norte Km 25', agente: 'Radar Fijo #RF-102', fechaVencimiento: '2026-08-15' },
  { id: 'MLT-014', vehiculoPlaca: 'PBA-1234', tipo: 'Circulación en sentido contrario', descripcion: 'Circulación en sentido contrario en calle de un solo sentido', monto: 280.00, fecha: '2026-05-20', estado: 'pendiente', puntoInfraccion: 'Calle Juan León Mera, Quito', agente: 'Ag. Vaca #8901', fechaVencimiento: '2026-08-20' },
];

export const payments = [
  { id: 'PAY-001', multaId: 'MLT-002', monto: 80.00, metodo: 'Tarjeta de Crédito', referencia: 'REF-2026040201', fecha: '2026-04-05', estado: 'completado', titular: 'Carlos Mendoza Rivera', ultimos4Digitos: '4532' },
  { id: 'PAY-002', multaId: 'MLT-010', monto: 200.00, metodo: 'Transferencia Bancaria', referencia: 'REF-2026041501', fecha: '2026-04-15', estado: 'completado', titular: 'Lucía Herrera Campos', ultimos4Digitos: '7891' },
];

export const appeals = [
  { id: 'APL-001', multaId: 'MLT-004', cedula: '0923456789', motivo: 'Error en la medición', descripcion: 'La velocidad registrada no corresponde con la realidad. Mi vehículo tiene un limitador de velocidad configurado a 110km/h. Adjunto evidencia del taller mecánico certificado.', documentos: [{ nombre: 'certificado_taller.pdf', tipo: 'application/pdf', tamanio: 245000, fecha: '2026-03-01' }, { nombre: 'foto_velocimetro.jpg', tipo: 'image/jpeg', tamanio: 1200000, fecha: '2026-03-01' }], estado: 'en_revision', fechaCreacion: '2026-03-01', fechaRespuesta: null, respuesta: null },
  { id: 'APL-002', multaId: 'MLT-006', cedula: '0102345678', motivo: 'Vehículo no estaba en el lugar', descripcion: 'En la fecha indicada mi vehículo se encontraba en el taller mecánico por reparaciones. Adjunto orden de trabajo del taller con fechas.', documentos: [{ nombre: 'orden_trabajo_taller.pdf', tipo: 'application/pdf', tamanio: 180000, fecha: '2026-02-10' }], estado: 'rechazada', fechaCreacion: '2026-02-10', fechaRespuesta: '2026-03-15', respuesta: 'Tras revisión de cámaras de seguridad se confirma que el vehículo con placa XBA-7890 cometió la infracción en la fecha y hora indicadas.' },
];

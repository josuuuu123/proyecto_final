import { useState } from 'react';
import { searchByCedula, verifyPendingFines } from '../../application/useCases';
import { Search, AlertCircle, AlertTriangle, User, Car, Calendar, Palette, ClipboardList } from 'lucide-react';

export default function Busqueda() {
  const [cedula, setCedula] = useState('');
  const [result, setResult] = useState(null);
  const [pendingInfo, setPendingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [error, setError] = useState('');

  async function handleSearch(e) {
    e.preventDefault();
    if (!cedula.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);
    setPendingInfo(null);
    setSelectedVehicle(null);

    try {
      const data = await searchByCedula(cedula.trim());
      if (!data.found) {
        setError('No se encontró un propietario con esa cédula');
        return;
      }
      setResult(data);

      // Verificación automática de multas pendientes
      const pending = await verifyPendingFines(cedula.trim());
      setPendingInfo(pending);
    } catch (err) {
      setError('Error al realizar la búsqueda');
    } finally {
      setLoading(false);
    }
  }

  function getVehicleFines(placa) {
    if (!result) return [];
    return result.fines.filter(f => f.vehiculoPlaca === placa);
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Consultas de Infracciones</h1>
        <p className="page-subtitle">Consulte vehículos y multas asociadas a un propietario</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch}>
        <div className="search-container mb-xl">
          <span className="search-icon"><Search size={20} /></span>
          <input
            type="text"
            className="search-input"
            placeholder="Ingrese número de cédula (ej: 1712345678)"
            value={cedula}
            onChange={e => setCedula(e.target.value)}
            maxLength={10}
          />
          <button type="submit" className="btn btn-primary search-btn" disabled={loading}>
            {loading ? 'Consultando...' : 'Consultar'}
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="glass-card slide-up" style={{ borderColor: 'var(--color-danger)', marginBottom: 'var(--space-xl)' }}>
          <div className="empty-state" style={{ padding: 'var(--space-xl)' }}>
            <div className="empty-state-icon text-danger" style={{ color: 'var(--color-danger)' }}><AlertCircle size={48} /></div>
            <div className="empty-state-title">{error}</div>
            <div className="empty-state-text">Verifique el número de cédula e intente nuevamente.</div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-text">Consultando base de datos municipal...</div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="slide-up">
          {/* Pending Fines Alert */}
          {pendingInfo && pendingInfo.hasPending && (
            <div className="glass-card mb-xl" style={{ borderColor: '#fcd34d', background: '#fffbeb' }}>
              <div className="flex-between">
                <div className="flex gap-md" style={{ alignItems: 'center' }}>
                  <span style={{ color: '#d97706' }}><AlertTriangle size={32} /></span>
                  <div>
                    <h3 style={{ color: '#d97706' }}>Infracciones Pendientes Detectadas</h3>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: '#92400e' }}>
                      El ciudadano registra <strong>{pendingInfo.count}</strong> infracción(es) pendiente(s) por un valor total de{' '}
                      <strong>${pendingInfo.totalAmount.toFixed(2)}</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Owner Info */}
          <div className="glass-card mb-xl">
            <div className="glass-card-header">
              <h2 className="glass-card-title flex" style={{ gap: '8px' }}><User /> Datos del Ciudadano</h2>
              <span className={`status-badge ${pendingInfo?.hasPending ? 'pendiente' : 'pagada'}`}>
                {pendingInfo?.hasPending ? 'Valores Pendientes' : 'Al Día'}
              </span>
            </div>
            <div className="grid-2">
              <div>
                <div className="info-row">
                  <span className="info-label">Cédula</span>
                  <span className="info-value">{result.owner.cedula}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Nombre</span>
                  <span className="info-value">{result.owner.nombre} {result.owner.apellido}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email</span>
                  <span className="info-value">{result.owner.email}</span>
                </div>
              </div>
              <div>
                <div className="info-row">
                  <span className="info-label">Teléfono</span>
                  <span className="info-value">{result.owner.telefono}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Dirección</span>
                  <span className="info-value">{result.owner.direccion}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Vehículos Registrados</span>
                  <span className="info-value">{result.vehicles.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicles */}
          <h2 className="flex" style={{ gap: '8px', fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-lg)', color: 'var(--color-primary)' }}>
            <Car /> Vehículos Registrados ({result.vehicles.length})
          </h2>
          <div className="grid-2 mb-xl">
            {result.vehicles.map(vehicle => {
              const vFines = getVehicleFines(vehicle.placa);
              const pendingCount = vFines.filter(f => f.estado === 'pendiente' || f.estado === 'vencida').length;
              return (
                <div
                  key={vehicle.placa}
                  className={`vehicle-card ${selectedVehicle === vehicle.placa ? 'selected' : ''}`}
                  onClick={() => setSelectedVehicle(selectedVehicle === vehicle.placa ? null : vehicle.placa)}
                >
                  <div className="vehicle-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="vehicle-card-plate">{vehicle.placa}</span>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{vehicle.tipo}</span>
                    {pendingCount > 0 && (
                      <span className="status-badge pendiente" style={{ marginLeft: 'auto' }}>
                        {pendingCount} pendiente(s)
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>{vehicle.marca} {vehicle.modelo}</div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                    <span className="flex" style={{ gap: '4px' }}><Calendar size={16} /> {vehicle.anio}</span>
                    <span className="flex" style={{ gap: '4px' }}><Palette size={16} /> {vehicle.color}</span>
                    <span className="flex" style={{ gap: '4px' }}><ClipboardList size={16} /> {vFines.length} infracciones</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fines for selected vehicle */}
          {selectedVehicle && (
            <div className="glass-card slide-up">
              <div className="glass-card-header">
                <h2 className="glass-card-title flex" style={{ gap: '8px' }}>
                  <ClipboardList /> Detalle de Infracciones: {selectedVehicle}
                </h2>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {getVehicleFines(selectedVehicle).length} registro(s)
                </span>
              </div>
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Nro. Ticket</th>
                      <th>Tipo de Infracción</th>
                      <th>Fecha</th>
                      <th>Valor</th>
                      <th>Estado</th>
                      <th>Ubicación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getVehicleFines(selectedVehicle).map(fine => (
                      <tr key={fine.id}>
                        <td style={{ fontWeight: 600 }}>{fine.id}</td>
                        <td>{fine.tipo}</td>
                        <td>{fine.fecha}</td>
                        <td style={{ fontWeight: 600 }}>${fine.monto.toFixed(2)}</td>
                        <td>
                          <span className={`status-badge ${fine.estado}`}>
                            {fine.estado}
                          </span>
                        </td>
                        <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                          {fine.puntoInfraccion}
                        </td>
                      </tr>
                    ))}
                    {getVehicleFines(selectedVehicle).length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center" style={{ padding: 'var(--space-2xl)' }}>
                          No hay infracciones registradas para este vehículo.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Default state */}
      {!result && !loading && !error && (
        <div className="glass-card">
          <div className="empty-state">
            <div className="empty-state-icon" style={{ color: 'var(--text-muted)' }}><Search size={48} /></div>
            <div className="empty-state-title">Sistema de Consultas</div>
            <div className="empty-state-text">
              Ingrese un número de cédula válido para consultar los vehículos registrados y las obligaciones pendientes del ciudadano.
            </div>
            <div className="mt-lg" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '8px 16px', borderRadius: '4px' }}>
              <strong>Casos de prueba:</strong> 1712345678 (Con multas) · 0923456789 (Con apelaciones)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

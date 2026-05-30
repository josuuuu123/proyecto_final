import { useState, useEffect } from 'react';
import { getAllFines } from '../../application/useCases';

export default function Multas() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todas');

  useEffect(() => {
    loadFines();
  }, []);

  async function loadFines() {
    setLoading(true);
    try {
      const data = await getAllFines();
      setFines(data);
    } catch (err) {
      console.error('Error loading fines:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredFines = fines.filter(fine => {
    if (filter === 'todas') return true;
    if (filter === 'pendientes') return fine.estado === 'pendiente' || fine.estado === 'vencida';
    if (filter === 'pagadas') return fine.estado === 'pagada';
    if (filter === 'apeladas') return fine.estado === 'apelada';
    return true;
  });

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <div className="spinner-text">Cargando multas...</div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Historial de Multas</h1>
        <p className="page-subtitle">Visualización de todas las multas registradas en el sistema</p>
      </div>

      <div className="glass-card mb-xl">
        <div className="tabs">
          <div 
            className={`tab ${filter === 'todas' ? 'active' : ''}`}
            onClick={() => setFilter('todas')}
          >
            Todas ({fines.length})
          </div>
          <div 
            className={`tab ${filter === 'pendientes' ? 'active' : ''}`}
            onClick={() => setFilter('pendientes')}
          >
            Pendientes ({fines.filter(f => f.estado === 'pendiente' || f.estado === 'vencida').length})
          </div>
          <div 
            className={`tab ${filter === 'pagadas' ? 'active' : ''}`}
            onClick={() => setFilter('pagadas')}
          >
            Pagadas ({fines.filter(f => f.estado === 'pagada').length})
          </div>
          <div 
            className={`tab ${filter === 'apeladas' ? 'active' : ''}`}
            onClick={() => setFilter('apeladas')}
          >
            Apeladas ({fines.filter(f => f.estado === 'apelada').length})
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Placa</th>
                <th>Infracción</th>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredFines.map(fine => (
                <tr key={fine.id}>
                  <td style={{ fontWeight: 600 }}>{fine.id}</td>
                  <td>
                    <span className="vehicle-card-plate" style={{ fontSize: '10px', padding: '4px 8px' }}>
                      {fine.vehiculoPlaca}
                    </span>
                  </td>
                  <td>
                    <div>{fine.tipo}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                      {fine.puntoInfraccion}
                    </div>
                  </td>
                  <td>{fine.fecha}</td>
                  <td style={{ fontWeight: 600 }}>${fine.monto.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${fine.estado}`}>
                      <span className="status-dot"></span>
                      {fine.estado}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredFines.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center" style={{ padding: 'var(--space-2xl)' }}>
                    No hay multas que coincidan con este filtro
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

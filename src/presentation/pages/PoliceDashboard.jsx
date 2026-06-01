import React, { useEffect, useState } from 'react';
import { getAllFines } from '../../application/useCases';
import { Shield, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PoliceDashboard() {
  const { user } = useAuth();
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFines = async () => {
      try {
        const allFines = await getAllFines();
        // Simulamos que el dashboard del policía muestra las últimas multas emitidas por él
        // Por ahora mostraremos todas ordenadas por fecha
        const recent = allFines.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 10);
        setFines(recent);
      } catch (error) {
        console.error('Error fetching fines:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFines();
  }, []);

  if (loading) {
    return <div className="p-xl text-center">Cargando datos...</div>;
  }

  return (
    <div className="page-container fade-in">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">Panel de Control Policial</h1>
          <p className="page-subtitle">Bienvenido, Oficial {user?.nombre}. Resumen de tu turno.</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))', padding: '12px 24px', borderRadius: 'var(--border-radius-lg)', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 4px 15px rgba(15, 74, 138, 0.2)' }}>
          <Shield size={32} color="#ffffff" />
          <div style={{ color: '#ffffff' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.9 }}>ESTADO</div>
            <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>En Servicio</div>
          </div>
        </div>
      </header>

      <div className="stats-grid mb-xl">
        <div className="stat-card" style={{ borderTop: '4px solid #3b82f6', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#3b82f6', width: '48px', height: '48px', borderRadius: '12px', marginBottom: '16px' }}>
            <AlertCircle size={24} />
          </div>
          <div className="stat-value" style={{ fontSize: '2rem', color: '#1e293b' }}>{fines.length}</div>
          <div className="stat-label" style={{ color: '#64748b', fontWeight: '600' }}>Multas Emitidas Hoy</div>
        </div>
        <div className="stat-card" style={{ borderTop: '4px solid #ef4444', background: 'linear-gradient(180deg, #ffffff 0%, #fcf3f3 100%)' }}>
          <div className="stat-icon" style={{ background: '#fef2f2', color: '#ef4444', width: '48px', height: '48px', borderRadius: '12px', marginBottom: '16px' }}>
            <Clock size={24} />
          </div>
          <div className="stat-value" style={{ fontSize: '1.5rem', marginTop: '8px', color: '#1e293b' }}>Activo</div>
          <div className="stat-label" style={{ color: '#64748b', fontWeight: '600' }}>Estado de Sistema</div>
        </div>
        <div className="stat-card" style={{ borderTop: '4px solid #10b981', background: 'linear-gradient(180deg, #ffffff 0%, #f2fbf7 100%)' }}>
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981', width: '48px', height: '48px', borderRadius: '12px', marginBottom: '16px' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-value" style={{ fontSize: '2rem', color: '#1e293b' }}>100%</div>
          <div className="stat-label" style={{ color: '#64748b', fontWeight: '600' }}>Sincronización</div>
        </div>
      </div>

      <div className="card" style={{ border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div className="card-header" style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', margin: 0, borderRadius: '8px 8px 0 0' }}>
          <h2 className="card-title" style={{ fontSize: '1.1rem', margin: 0 }}>Últimas Infracciones Registradas</h2>
        </div>
        <div className="card-body p-0">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Infracción</th>
                  <th>Fecha</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {fines.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center" style={{ padding: 'var(--space-xl)' }}>No has emitido multas recientemente.</td>
                  </tr>
                ) : (
                  fines.map(fine => (
                    <tr key={fine.id}>
                      <td><span className="badge badge-outline">{fine.vehiculoPlaca}</span></td>
                      <td>{fine.tipo}</td>
                      <td>{new Date(fine.fecha).toLocaleDateString()}</td>
                      <td>${fine.monto.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge status-${fine.estado === 'pendiente' ? 'pending' : (fine.estado === 'pagada' ? 'success' : 'danger')}`}>
                          {fine.estado.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

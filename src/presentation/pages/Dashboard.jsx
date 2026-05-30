import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../application/useCases';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle, AlertTriangle, DollarSign, Search, CreditCard } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <div className="spinner-text">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Resumen general del sistema de gestión de multas</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-card-icon"><FileText size={24} /></div>
          <div className="stat-card-value">{stats.totalFines}</div>
          <div className="stat-card-label">Total de Multas</div>
        </div>

        <div className="stat-card warning">
          <div className="stat-card-icon"><Clock size={24} /></div>
          <div className="stat-card-value">{stats.pendingFines}</div>
          <div className="stat-card-label">Multas Pendientes</div>
        </div>

        <div className="stat-card success">
          <div className="stat-card-icon"><CheckCircle size={24} /></div>
          <div className="stat-card-value">{stats.paidFines}</div>
          <div className="stat-card-label">Multas Pagadas</div>
        </div>

        <div className="stat-card danger">
          <div className="stat-card-icon"><AlertTriangle size={24} /></div>
          <div className="stat-card-value">{stats.overdueFines}</div>
          <div className="stat-card-label">Multas Vencidas</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="glass-card">
          <div className="glass-card-header">
            <h2 className="glass-card-title flex" style={{ gap: '8px' }}><DollarSign className="text-secondary" /> Resumen Financiero</h2>
          </div>
          <div className="info-row">
            <span className="info-label">Total Pendiente de Cobro</span>
            <span className="info-value" style={{ color: 'var(--color-warning)' }}>
              ${stats.totalPendingAmount.toFixed(2)}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Total Recaudado</span>
            <span className="info-value" style={{ color: 'var(--color-success)' }}>
              ${stats.totalCollected.toFixed(2)}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Apelaciones Activas</span>
            <span className="info-value">{stats.totalAppeals}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Multas Apeladas</span>
            <span className="info-value">{stats.appealedFines}</span>
          </div>
        </div>

        <div className="glass-card">
          <div className="glass-card-header">
            <h2 className="glass-card-title flex" style={{ gap: '8px' }}><Clock className="text-primary" /> Multas Recientes</h2>
          </div>
          <div className="timeline">
            {stats.recentFines.map(fine => (
              <div key={fine.id} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-date">{fine.fecha}</div>
                <div className="timeline-content">
                  <strong>{fine.id}</strong> — {fine.tipo}
                  <div style={{ marginTop: 4 }}>
                    <span className={`status-badge ${fine.estado}`}>
                      {fine.estado}
                    </span>
                    <span style={{ marginLeft: 8, color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)' }}>
                      ${fine.monto.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-3 mt-xl">
        <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/busqueda')}>
          <div style={{ textAlign: 'center', padding: 'var(--space-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-md)', color: 'var(--color-primary)' }}><Search size={40} /></div>
            <h3 style={{ marginBottom: 'var(--space-sm)' }}>Buscar por Cédula</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              Consulta vehículos y multas por número de cédula
            </p>
          </div>
        </div>
        <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/pagos')}>
          <div style={{ textAlign: 'center', padding: 'var(--space-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-md)', color: 'var(--color-primary)' }}><CreditCard size={40} /></div>
            <h3 style={{ marginBottom: 'var(--space-sm)' }}>Realizar Pago</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              Paga tus multas pendientes de forma rápida y segura
            </p>
          </div>
        </div>
        <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/apelaciones')}>
          <div style={{ textAlign: 'center', padding: 'var(--space-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-md)', color: 'var(--color-primary)' }}><FileText size={40} /></div>
            <h3 style={{ marginBottom: 'var(--space-sm)' }}>Apelaciones</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              Gestiona tus apelaciones y sube documentos de respaldo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { issueFine } from '../../application/useCases';
import { useNavigate } from 'react-router-dom';
import { FileText, Car, DollarSign, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { FINE_TYPES } from '../../domain/entities/Fine';

export default function EmitirMulta() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    vehiculoPlaca: '',
    tipo: Object.keys(FINE_TYPES)[0],
    descripcion: '',
    monto: '',
    puntoInfraccion: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await issueFine({
        vehiculoPlaca: formData.vehiculoPlaca.toUpperCase(),
        tipo: FINE_TYPES[formData.tipo],
        descripcion: formData.descripcion,
        monto: Number(formData.monto),
        puntoInfraccion: formData.puntoInfraccion
      });
      setSuccess(true);
      setFormData({
        vehiculoPlaca: '',
        tipo: Object.keys(FINE_TYPES)[0],
        descripcion: '',
        monto: '',
        puntoInfraccion: ''
      });
      setTimeout(() => {
        setSuccess(false);
        navigate('/policia');
      }, 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">Emitir Nueva Multa</h1>
          <p className="page-subtitle">Complete los datos de la infracción para registrarla en el sistema.</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))', padding: '12px 24px', borderRadius: 'var(--border-radius-lg)', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 4px 15px rgba(15, 74, 138, 0.2)' }}>
          <FileText size={32} color="#ffffff" />
          <div style={{ color: '#ffffff' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.9 }}>ACCIÓN</div>
            <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>Registro Oficial</div>
          </div>
        </div>
      </header>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div className="card-header" style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', margin: 0, borderRadius: '8px 8px 0 0' }}>
          <h2 className="card-title" style={{ fontSize: '1.1rem', margin: 0 }}>Formulario de Infracción</h2>
        </div>
        <div className="card-body" style={{ padding: '24px' }}>
          {error && (
            <div className="alert alert-danger" style={{ marginBottom: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', background: '#fef2f2', color: 'var(--color-danger)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="alert alert-success" style={{ marginBottom: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', background: '#f0fdf4', color: 'var(--color-success)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
              <CheckCircle size={20} />
              <span>Multa emitida correctamente. Redirigiendo...</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-md">
              <label className="form-label">Placa del Vehículo</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Car size={18} />
                </div>
                <input 
                  type="text" 
                  className="form-control" 
                  name="vehiculoPlaca"
                  placeholder="ABC-1234"
                  value={formData.vehiculoPlaca}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: '40px', textTransform: 'uppercase' }}
                />
              </div>
            </div>

            <div className="form-group mb-md">
              <label className="form-label">Tipo de Infracción</label>
              <select 
                className="form-control" 
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
              >
                {Object.entries(FINE_TYPES).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>

            <div className="form-group mb-md">
              <label className="form-label">Descripción / Observaciones</label>
              <textarea 
                className="form-control" 
                name="descripcion"
                rows="3"
                placeholder="Detalles adicionales de la infracción..."
                value={formData.descripcion}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-group mb-md">
              <label className="form-label">Monto de la Multa ($)</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <DollarSign size={18} />
                </div>
                <input 
                  type="number" 
                  min="0"
                  step="0.01"
                  className="form-control" 
                  name="monto"
                  placeholder="0.00"
                  value={formData.monto}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>

            <div className="form-group mb-lg">
              <label className="form-label">Punto de Infracción (Dirección)</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <MapPin size={18} />
                </div>
                <input 
                  type="text" 
                  className="form-control" 
                  name="puntoInfraccion"
                  placeholder="Ej: Av. 24 de Mayo y Simón Bolívar"
                  value={formData.puntoInfraccion}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={() => navigate('/policia')}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Emitir Multa'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

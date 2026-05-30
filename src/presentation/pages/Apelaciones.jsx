import { useState, useEffect } from 'react';
import { getAllAppeals, verifyPendingFines, createAppeal } from '../../application/useCases';
import { Search, FileText, Paperclip, X, PlusCircle } from 'lucide-react';

export default function Apelaciones() {
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  
  // Form state
  const [cedula, setCedula] = useState('');
  const [pendingFines, setPendingFines] = useState([]);
  const [selectedFine, setSelectedFine] = useState(null);
  const [motivo, setMotivo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAppeals();
  }, []);

  async function loadAppeals() {
    setLoading(true);
    try {
      const data = await getAllAppeals();
      setAppeals(data);
    } catch (err) {
      console.error('Error loading appeals:', err);
    } finally {
      setLoading(false);
    }
  }

  // Handle Search for Modal
  async function handleSearch(e) {
    e.preventDefault();
    if (!cedula) return;
    
    setIsSubmitting(true);
    setError('');
    try {
      const data = await verifyPendingFines(cedula);
      if (!data.hasPending) {
        setError('No se encontraron multas pendientes para apelar con esta cédula');
        setPendingFines([]);
      } else {
        setPendingFines(data.fines);
      }
    } catch (err) {
      setError('Error al consultar multas');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle File Upload Simulation
  function handleFileChange(e) {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
        type: file.type
      }));
      setFiles([...files, ...newFiles]);
    }
  }

  function removeFile(index) {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  }

  // Submit Appeal
  async function handleSubmit() {
    if (!selectedFine || !motivo || !descripcion) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Simulate file upload metadata
      const documentos = files.map(f => ({
        nombre: f.name,
        tipo: f.type,
        tamanio: f.file.size,
        fecha: new Date().toISOString().split('T')[0]
      }));

      await createAppeal(selectedFine.id, {
        cedula,
        motivo,
        descripcion,
        documentos
      });

      // Reset and close
      await loadAppeals();
      closeModal();
    } catch (err) {
      setError('Error al ingresar el trámite: ' + err.message);
      setIsSubmitting(false);
    }
  }

  function closeModal() {
    setShowModal(false);
    setModalStep(1);
    setCedula('');
    setPendingFines([]);
    setSelectedFine(null);
    setMotivo('');
    setDescripcion('');
    setFiles([]);
    setError('');
  }

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <div className="spinner-text">Cargando trámites...</div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">Trámites y Apelaciones</h1>
          <p className="page-subtitle">Sistema de revisión e impugnación de infracciones de tránsito</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <PlusCircle size={18} /> Ingresar Trámite
        </button>
      </div>

      <div className="glass-card">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nro. Trámite</th>
                <th>Infracción Ref.</th>
                <th>Fecha Ingreso</th>
                <th>Motivo de Impugnación</th>
                <th>Sustentos</th>
                <th>Estado Actual</th>
              </tr>
            </thead>
            <tbody>
              {appeals.map(appeal => (
                <tr key={appeal.id}>
                  <td style={{ fontWeight: 600 }}>{appeal.id}</td>
                  <td>{appeal.multaId}</td>
                  <td>{appeal.fechaCreacion}</td>
                  <td>{appeal.motivo}</td>
                  <td>{appeal.documentos?.length || 0} archivo(s) anexos</td>
                  <td>
                    <span className={`status-badge ${appeal.estado}`}>
                      {appeal.estado.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
              {appeals.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center" style={{ padding: 'var(--space-2xl)' }}>
                    No existen trámites registrados en el sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nueva Apelación */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Ingreso de Nuevo Trámite</h2>
              <button className="modal-close" onClick={closeModal}><X size={24} /></button>
            </div>
            
            <div className="modal-body">
              {error && <div className="toast error mb-md" style={{ position: 'relative', bottom: 0, right: 0, animation: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}><X size={16}/> {error}</div>}
              
              {/* Step 1: Buscar Multa */}
              {modalStep === 1 && (
                <div className="slide-up">
                  <h3 className="mb-md" style={{ fontSize: 'var(--font-size-md)' }}>1. Buscar Infracción a Impugnar</h3>
                  <form onSubmit={handleSearch} className="mb-lg">
                    <div className="search-container" style={{ maxWidth: '100%' }}>
                      <span className="search-icon"><Search size={20} /></span>
                      <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Ingrese la cédula del propietario"
                        value={cedula}
                        onChange={e => setCedula(e.target.value)}
                      />
                      <button type="submit" className="btn btn-primary search-btn" disabled={isSubmitting || !cedula}>
                        Buscar
                      </button>
                    </div>
                  </form>

                  {pendingFines.length > 0 && (
                    <div>
                      <h4 className="mb-sm text-secondary">Seleccione la infracción objeto del trámite:</h4>
                      <div className="grid-1 gap-sm" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {pendingFines.map(fine => (
                          <div 
                            key={fine.id}
                            className={`vehicle-card ${selectedFine?.id === fine.id ? 'selected' : ''}`}
                            style={{ padding: 'var(--space-md)' }}
                            onClick={() => setSelectedFine(fine)}
                          >
                            <div className="flex-between">
                              <div>
                                <div style={{ fontWeight: 600 }}>{fine.tipo}</div>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                                  {fine.id} • Placa: {fine.vehiculoPlaca} • {fine.fecha}
                                </div>
                              </div>
                              <div style={{ fontWeight: 600, color: 'var(--color-warning)' }}>
                                ${fine.monto.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Formulario y Documentos */}
              {modalStep === 2 && (
                <div className="slide-up">
                  <div className="mb-md p-md bg-input" style={{ background: 'var(--bg-tertiary)', padding: 'var(--space-md)', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Infracción seleccionada para impugnación:</div>
                    <div style={{ fontWeight: 600, color: 'var(--color-primary)', marginTop: '4px' }}>{selectedFine.id} - {selectedFine.tipo}</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Motivo de la Impugnación *</label>
                    <select 
                      className="form-select"
                      value={motivo}
                      onChange={e => setMotivo(e.target.value)}
                    >
                      <option value="">Seleccione el motivo principal...</option>
                      <option value="Error en la medición">Falla o error en dispositivo de medición (Radar/Cámara)</option>
                      <option value="Vehículo no estaba en el lugar">Vehículo en ubicación distinta (sustentado)</option>
                      <option value="Emergencia médica probada">Fuerza mayor: Emergencia médica comprobable</option>
                      <option value="Vehículo robado (con denuncia)">Vehículo reportado como robado (adjuntar denuncia)</option>
                      <option value="Otro">Otros motivos debidamente justificados</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Exposición de Hechos *</label>
                    <textarea 
                      className="form-textarea"
                      placeholder="Redacte de manera clara y concisa los hechos que fundamentan su solicitud de impugnación..."
                      value={descripcion}
                      onChange={e => setDescripcion(e.target.value)}
                      style={{ minHeight: '120px' }}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Documentación de Sustento (Anexos)</label>
                    <div className="file-upload-area" onClick={() => document.getElementById('file-upload').click()}>
                      <div className="file-upload-icon flex-center" style={{ color: 'var(--color-primary)', marginBottom: '8px' }}><FileText size={32} /></div>
                      <div className="file-upload-text" style={{ fontWeight: 500 }}>Haga clic o arrastre sus documentos aquí</div>
                      <div className="file-upload-hint">Formatos aceptados: PDF, JPG, PNG (Peso máx. 5MB)</div>
                      <input 
                        id="file-upload" 
                        type="file" 
                        multiple 
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </div>

                    {files.length > 0 && (
                      <div className="file-list" style={{ marginTop: '16px' }}>
                        {files.map((f, index) => (
                          <div key={index} className="file-item" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', padding: '8px 12px', borderRadius: '4px', marginBottom: '8px' }}>
                            <span className="file-item-icon" style={{ color: 'var(--text-muted)', marginRight: '12px' }}><Paperclip size={16} /></span>
                            <div className="file-item-info" style={{ flex: 1 }}>
                              <div className="file-item-name" style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{f.name}</div>
                              <div className="file-item-size" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{f.size}</div>
                            </div>
                            <button className="file-item-remove btn-ghost" style={{ padding: '4px' }} onClick={() => removeFile(index)}><X size={16} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal} disabled={isSubmitting}>
                Cancelar
              </button>
              
              {modalStep === 1 && (
                <button 
                  className="btn btn-primary" 
                  onClick={() => setModalStep(2)}
                  disabled={!selectedFine}
                >
                  Continuar
                </button>
              )}
              
              {modalStep === 2 && (
                <>
                  <button className="btn btn-outline" onClick={() => setModalStep(1)} disabled={isSubmitting}>
                    Atrás
                  </button>
                  <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Registrando Trámite...' : 'Ingresar Trámite'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

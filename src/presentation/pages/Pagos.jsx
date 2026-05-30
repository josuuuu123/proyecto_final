import { useState } from 'react';
import { verifyPendingFines, processPayment } from '../../application/useCases';
import { AlertTriangle, Check, CreditCard, Landmark, Lock, Printer, CheckCircle } from 'lucide-react';

export default function Pagos() {
  const [step, setStep] = useState(1);
  const [cedula, setCedula] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingFines, setPendingFines] = useState(null);
  const [selectedFines, setSelectedFines] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentData, setPaymentData] = useState({
    titular: '',
    numeroTarjeta: '',
    vencimiento: '',
    cvv: ''
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');

  // Step 1: Búsqueda
  async function handleSearch(e) {
    e.preventDefault();
    if (!cedula) return;

    setLoading(true);
    setError('');
    try {
      const data = await verifyPendingFines(cedula);
      if (!data.hasPending) {
        setError('No se encontraron multas pendientes para esta cédula');
        return;
      }
      setPendingFines(data);
      // Seleccionar todas por defecto
      setSelectedFines(data.fines.map(f => f.id));
      setStep(2);
    } catch (err) {
      setError('Error al consultar multas');
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Selección
  function toggleFine(fineId) {
    if (selectedFines.includes(fineId)) {
      setSelectedFines(selectedFines.filter(id => id !== fineId));
    } else {
      setSelectedFines([...selectedFines, fineId]);
    }
  }

  const totalToPay = pendingFines?.fines
    .filter(f => selectedFines.includes(f.id))
    .reduce((sum, f) => sum + f.monto, 0) || 0;

  function continueToPayment() {
    if (selectedFines.length === 0) {
      setError('Debes seleccionar al menos una multa');
      return;
    }
    setError('');
    setStep(3);
  }

  // Step 3: Pago
  async function handlePayment(e) {
    e.preventDefault();
    if (!paymentMethod) {
      setError('Selecciona un método de pago');
      return;
    }
    if (!paymentData.titular || !paymentData.numeroTarjeta) {
      setError('Completa los datos de la tarjeta');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Procesar cada multa seleccionada (simulación de carrito)
      const ultimos4 = paymentData.numeroTarjeta.slice(-4);
      let lastPayment = null;

      for (const fineId of selectedFines) {
        lastPayment = await processPayment(fineId, {
          metodo: paymentMethod,
          titular: paymentData.titular,
          ultimos4Digitos: ultimos4
        });
      }

      setReceipt({
        id: lastPayment.referencia, // Usar la última referencia como ID de recibo global
        fecha: new Date().toLocaleDateString(),
        montoTotal: totalToPay,
        metodo: paymentMethod,
        tarjeta: `**** **** **** ${ultimos4}`,
        multas: selectedFines.length
      });
      
      setPaymentSuccess(true);
      setStep(4);
    } catch (err) {
      setError('Error al procesar el pago: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  function resetFlow() {
    setStep(1);
    setCedula('');
    setPendingFines(null);
    setSelectedFines([]);
    setPaymentSuccess(false);
    setReceipt(null);
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Pasarela de Pagos en Línea</h1>
        <p className="page-subtitle">Sistema seguro de recaudación municipal</p>
      </div>

      {/* Stepper Progress */}
      <div className="mb-xl flex-center gap-md" style={{ opacity: step === 4 ? 0 : 1 }}>
        <div className={`status-badge ${step >= 1 ? 'en_revision' : ''}`}>1. Consultar</div>
        <div style={{ width: '40px', height: '2px', background: step >= 2 ? 'var(--color-primary)' : 'var(--border-color)' }}></div>
        <div className={`status-badge ${step >= 2 ? 'en_revision' : ''}`}>2. Seleccionar</div>
        <div style={{ width: '40px', height: '2px', background: step >= 3 ? 'var(--color-primary)' : 'var(--border-color)' }}></div>
        <div className={`status-badge ${step >= 3 ? 'en_revision' : ''}`}>3. Pagar</div>
      </div>

      {error && (
        <div className="toast error slide-up" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={20} /> {error}
        </div>
      )}

      {/* Step 1: Búsqueda */}
      {step === 1 && (
        <div className="glass-card slide-up" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="glass-card-header">
            <h2 className="glass-card-title">Consultar Obligaciones Pendientes</h2>
          </div>
          <form onSubmit={handleSearch}>
            <div className="form-group">
              <label className="form-label">Número de Cédula</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ej: 1712345678"
                value={cedula}
                onChange={e => setCedula(e.target.value)}
                maxLength={10}
              />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading || !cedula}>
              {loading ? 'Consultando...' : 'Consultar Valores'}
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Selección */}
      {step === 2 && pendingFines && (
        <div className="slide-up">
          <button className="btn btn-ghost mb-md" onClick={() => setStep(1)}>
            ← Volver a buscar
          </button>
          
          <div className="grid-2">
            <div>
              <h2 className="mb-md" style={{ fontSize: 'var(--font-size-xl)' }}>Infracciones Pendientes ({pendingFines.fines.length})</h2>
              {pendingFines.fines.map(fine => (
                <div 
                  key={fine.id} 
                  className={`glass-card mb-md ${selectedFines.includes(fine.id) ? 'selected' : ''}`}
                  style={{ cursor: 'pointer', padding: 'var(--space-md)' }}
                  onClick={() => toggleFine(fine.id)}
                >
                  <div className="flex-between">
                    <div className="flex gap-md" style={{ alignItems: 'center' }}>
                      <div style={{ 
                        width: '24px', height: '24px', borderRadius: '4px', 
                        border: '2px solid var(--color-primary)',
                        background: selectedFines.includes(fine.id) ? 'var(--color-primary)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                      }}>
                        {selectedFines.includes(fine.id) && <Check size={16} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{fine.tipo}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                          {fine.id} • Placa: {fine.vehiculoPlaca}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)', color: 'var(--color-primary)' }}>
                      ${fine.monto.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="payment-summary">
                <h3 className="mb-md">Resumen de Liquidación</h3>
                <div className="info-row">
                  <span className="info-label">Multas seleccionadas</span>
                  <span className="info-value">{selectedFines.length}</span>
                </div>
                <div className="payment-summary-row total">
                  <span>Total a Pagar</span>
                  <span className="amount">${totalToPay.toFixed(2)}</span>
                </div>
                <button 
                  className="btn btn-primary w-full mt-lg btn-lg" 
                  onClick={continueToPayment}
                  disabled={selectedFines.length === 0}
                >
                  Continuar al Pago
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Pago */}
      {step === 3 && (
        <div className="slide-up">
          <button className="btn btn-ghost mb-md" onClick={() => setStep(2)}>
            ← Volver a selección
          </button>
          
          <div className="grid-2">
            <div>
              <div className="glass-card mb-lg">
                <h3 className="glass-card-title mb-md">Método de Pago</h3>
                <div className="grid-2 gap-sm">
                  <div 
                    style={{ padding: '16px', border: '2px solid', borderColor: paymentMethod === 'Tarjeta de Crédito' ? 'var(--color-primary)' : 'var(--border-color)', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', background: paymentMethod === 'Tarjeta de Crédito' ? 'var(--bg-tertiary)' : 'transparent' }}
                    onClick={() => setPaymentMethod('Tarjeta de Crédito')}
                  >
                    <div className="flex-center mb-sm" style={{ color: 'var(--color-primary)' }}><CreditCard size={32} /></div>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Tarjeta de Crédito</div>
                  </div>
                  <div 
                    style={{ padding: '16px', border: '2px solid', borderColor: paymentMethod === 'Tarjeta de Débito' ? 'var(--color-primary)' : 'var(--border-color)', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', background: paymentMethod === 'Tarjeta de Débito' ? 'var(--bg-tertiary)' : 'transparent' }}
                    onClick={() => setPaymentMethod('Tarjeta de Débito')}
                  >
                    <div className="flex-center mb-sm" style={{ color: 'var(--color-primary)' }}><Landmark size={32} /></div>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Tarjeta de Débito</div>
                  </div>
                </div>
              </div>

              {paymentMethod && (
                <div className="glass-card slide-up">
                  <h3 className="glass-card-title mb-md">Datos de la Tarjeta</h3>
                  <form id="payment-form" onSubmit={handlePayment}>
                    <div className="form-group">
                      <label className="form-label">Titular de la Tarjeta</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Nombre completo tal como aparece en la tarjeta"
                        value={paymentData.titular}
                        onChange={e => setPaymentData({...paymentData, titular: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Número de Tarjeta</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="0000 0000 0000 0000"
                        maxLength="19"
                        value={paymentData.numeroTarjeta}
                        onChange={e => setPaymentData({...paymentData, numeroTarjeta: e.target.value})}
                      />
                    </div>
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Vencimiento</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="MM/AA"
                          maxLength="5"
                          value={paymentData.vencimiento}
                          onChange={e => setPaymentData({...paymentData, vencimiento: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input 
                          type="password" 
                          className="form-input" 
                          placeholder="123"
                          maxLength="4"
                          value={paymentData.cvv}
                          onChange={e => setPaymentData({...paymentData, cvv: e.target.value})}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div>
              <div className="payment-summary sticky" style={{ top: 'var(--space-xl)' }}>
                <h3 className="mb-md">Resumen de Pago</h3>
                <div className="info-row">
                  <span className="info-label">Obligaciones a pagar</span>
                  <span className="info-value">{selectedFines.length}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Cédula del ciudadano</span>
                  <span className="info-value">{cedula}</span>
                </div>
                <div className="payment-summary-row total">
                  <span>Total a Pagar</span>
                  <span className="amount">${totalToPay.toFixed(2)}</span>
                </div>
                <button 
                  type="submit" 
                  form="payment-form"
                  className="btn btn-success w-full mt-lg btn-lg" 
                  disabled={loading || !paymentMethod}
                >
                  {loading ? 'Procesando transacción...' : `Pagar $${totalToPay.toFixed(2)}`}
                </button>
                <div className="text-center mt-md flex-center gap-sm" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                  <Lock size={14} /> Pago seguro encriptado (SSL)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && paymentSuccess && receipt && (
        <div className="glass-card slide-up" style={{ maxWidth: '600px', margin: '0 auto', borderTop: '4px solid var(--color-success)' }}>
          <div className="text-center" style={{ padding: 'var(--space-xl) 0' }}>
            <div style={{ color: 'var(--color-success)', display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
              <CheckCircle size={80} />
            </div>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: 'var(--space-sm)' }}>¡Transacción Exitosa!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>El pago ha sido procesado y registrado correctamente en el sistema municipal.</p>
            
            <div className="text-left" style={{ background: 'var(--bg-tertiary)', padding: 'var(--space-lg)', borderRadius: 'var(--border-radius-md)', marginBottom: 'var(--space-xl)', border: '1px solid var(--border-color)' }}>
              <h4 className="mb-sm" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', color: 'var(--color-primary)' }}>Comprobante Electrónico de Pago</h4>
              <div className="info-row">
                <span className="info-label">Nro. Comprobante</span>
                <span className="info-value">{receipt.id}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Fecha y Hora</span>
                <span className="info-value">{receipt.fecha}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Forma de Pago</span>
                <span className="info-value">{receipt.metodo} ({receipt.tarjeta})</span>
              </div>
              <div className="info-row">
                <span className="info-label">Cantidad de trámites</span>
                <span className="info-value">{receipt.multas}</span>
              </div>
              <div className="info-row" style={{ borderTop: '1px solid var(--border-color)', marginTop: '8px', paddingTop: '8px' }}>
                <span className="info-label" style={{ fontWeight: 'bold' }}>Total Cancelado</span>
                <span className="info-value" style={{ color: 'var(--color-success)', fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>${receipt.montoTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex-center gap-md">
              <button className="btn btn-outline" onClick={() => window.print()}>
                <Printer size={16} /> Imprimir Comprobante
              </button>
              <button className="btn btn-primary" onClick={resetFlow}>
                Realizar otra consulta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

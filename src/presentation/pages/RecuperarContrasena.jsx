import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css'; // Podemos reusar los estilos del login

export default function RecuperarContrasena() {
  const [identificacion, setIdentificacion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [enviando, setEnviando] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setMensaje('');
    
    if (!identificacion) {
      setErrorMsg('Por favor ingrese su cédula o correo electrónico');
      return;
    }
    
    setEnviando(true);

    // Simulamos la llamada a una API
    setTimeout(() => {
      setEnviando(false);
      setMensaje('Si los datos son correctos, recibirá un correo con las instrucciones para recuperar su contraseña.');
      setIdentificacion('');
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-sidebar fade-in">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src="/logo.png" alt="Logo GAD Municipal de Girón" className="login-logo" />
        </div>

        <h2 style={{ color: '#0f4a8a', marginBottom: '16px', textAlign: 'center' }}>Recuperar Contraseña</h2>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '24px', textAlign: 'center' }}>
          Ingrese su número de cédula o correo electrónico registrado y le enviaremos las instrucciones.
        </p>

        {errorMsg && (
          <div className="login-alert slide-up">
            {errorMsg}
          </div>
        )}

        {mensaje && (
          <div className="login-alert slide-up" style={{ background: '#dcfce7', color: '#166534', borderColor: '#86efac' }}>
            {mensaje}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <input
            type="text"
            className="login-input"
            placeholder="Cédula o correo electrónico"
            value={identificacion}
            onChange={(e) => setIdentificacion(e.target.value)}
          />
          
          <button type="submit" className="login-btn" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar Instrucciones'}
          </button>
        </form>

        <div className="login-links" style={{ textAlign: 'center' }}>
          <Link to="/login" className="login-link">Volver al inicio de sesión</Link>
        </div>

        <div className="login-footer" style={{ marginTop: 'auto' }}>
          <div>
            <select>
              <option>Español - Internacional (es)</option>
              <option>English (en)</option>
            </select>
          </div>
          <div>
            <a href="#" style={{ color: '#00b4d8', textDecoration: 'none' }}>Aviso de privacidad</a>
          </div>
        </div>
      </div>
      
      <div className="login-hero">
        {/* La imagen de fondo se maneja por CSS */}
      </div>
    </div>
  );
}

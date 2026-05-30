import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { handleLogin, handleGuestLogin, loading } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!username || !password) {
      setErrorMsg('Por favor ingrese usuario y contraseña');
      return;
    }
    
    const result = await handleLogin(username, password);
    if (result.success) {
      navigate('/');
    } else {
      setErrorMsg(result.error || 'Credenciales inválidas');
    }
  };

  const onGuestLogin = () => {
    handleGuestLogin();
    navigate('/busqueda');
  };

  return (
    <div className="login-container">
      <div className="login-sidebar fade-in">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src="/logo.png" alt="Logo GAD Municipal de Girón" className="login-logo" />
        </div>

        {errorMsg && (
          <div className="login-alert slide-up">
            {errorMsg}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <input
            type="text"
            className="login-input"
            placeholder="Ingrese su usuario o cédula"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="login-input"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Verificando...' : 'Acceder'}
          </button>
        </form>

        <div className="login-links">
          <a href="#" className="login-link">¿Olvidó su contraseña?</a>
        </div>

        <div className="login-guest-box">
          <h3 className="login-guest-title">Acceso para ciudadanos y consultas de tránsito</h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '16px' }}>
            Si no es funcionario ni tiene cuenta registrada, puede ingresar como invitado para realizar consultas públicas.
          </p>
          <button type="button" className="login-guest-btn" onClick={onGuestLogin} disabled={loading}>
            Entrar como persona invitada
          </button>
        </div>

        <div className="login-footer">
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

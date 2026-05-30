import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Search, List, CreditCard, FileText, LogOut, User } from 'lucide-react';

export default function Sidebar() {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  // Definir qué enlaces ve cada rol
  const getLinksForRole = () => {
    if (!user) return [];
    
    const allLinks = [
      { to: '/', icon: <LayoutDashboard size={20} />, label: 'Inicio', roles: ['ADMIN', 'CLIENT'] },
      { to: '/busqueda', icon: <Search size={20} />, label: 'Consultas', roles: ['GUEST', 'ADMIN', 'CLIENT'] },
      { to: '/multas', icon: <List size={20} />, label: 'Historial', roles: ['ADMIN', 'CLIENT'] },
      { to: '/pagos', icon: <CreditCard size={20} />, label: 'Pagos en Línea', roles: ['CLIENT'] },
      { to: '/apelaciones', icon: <FileText size={20} />, label: 'Trámites y Apelaciones', roles: ['ADMIN', 'CLIENT'] },
    ];

    return allLinks.filter(link => link.roles.includes(user.rol));
  };

  const onLogout = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div className="sidebar-header">
        <img src="/logo.png" alt="Logo GAD Municipal de Girón" className="sidebar-logo-img" />
        <div className="sidebar-title">SISTEMA DE MULTAS</div>
        <div className="sidebar-subtitle">Tránsito y Movilidad</div>
      </div>

      <div style={{ padding: 'var(--space-md) var(--space-lg)', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
        <div className="flex" style={{ gap: '10px', alignItems: 'center' }}>
          <div style={{ background: 'var(--color-primary)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={16} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.nombre}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
              {user?.rol}
            </div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Menú Principal</div>
        {getLinksForRole().map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            end={link.to === '/'}
          >
            <span className="sidebar-link-icon">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer" style={{ padding: 'var(--space-md)', borderTop: '1px solid var(--border-color)', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
        <button 
          onClick={onLogout}
          className="btn btn-ghost w-full flex-center gap-sm"
          style={{ color: 'var(--color-danger)', marginBottom: 'var(--space-md)' }}
        >
          <LogOut size={16} /> Cerrar Sesión
        </button>
        <div style={{ textAlign: 'center' }}>
          <p>© 2026 GAD Municipal de Girón</p>
          <p>Todos los derechos reservados</p>
        </div>
      </div>
    </aside>
  );
}

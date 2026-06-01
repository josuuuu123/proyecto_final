import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Search, List, CreditCard, FileText, LogOut, User, X } from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const getLinksForRole = () => {
    if (!user) return [];
    
    const allLinks = [
      { to: '/', icon: <LayoutDashboard size={20} />, label: 'Inicio', roles: ['ADMIN', 'CLIENT'] },
      { to: '/busqueda', icon: <Search size={20} />, label: 'Consultas', roles: ['GUEST', 'ADMIN', 'CLIENT'] },
      { to: '/multas', icon: <List size={20} />, label: 'Historial', roles: ['ADMIN', 'CLIENT'] },
      { to: '/pagos', icon: <CreditCard size={20} />, label: 'Pagos en Línea', roles: ['CLIENT'] },
      { to: '/apelaciones', icon: <FileText size={20} />, label: 'Trámites', roles: ['ADMIN', 'CLIENT'] },
      { to: '/policia', icon: <LayoutDashboard size={20} />, label: 'Panel de Control', roles: ['POLICE'] },
      { to: '/policia/emitir', icon: <FileText size={20} />, label: 'Emitir Multa', roles: ['POLICE'] },
    ];

    return allLinks.filter(link => link.roles.includes(user.rol));
  };

  const onLogout = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)} />
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          {isOpen && (
            <button 
              onClick={() => setIsOpen(false)} 
              style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)' }}
            >
              <X size={24} />
            </button>
          )}
          <img src="/logo.png" alt="Logo GAD" className="sidebar-logo-img" />
          <div className="sidebar-title">SISTEMA MULTAS</div>
          <div className="sidebar-subtitle">Tránsito y Movilidad</div>
        </div>

        <div className="user-profile-widget">
          <div style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: 'white', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <User size={18} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.nombre}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--color-primary)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px' }}>
              {user?.rol}
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

        <div style={{ padding: 'var(--space-md)' }}>
          <button 
            onClick={onLogout}
            className="btn w-full"
            style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)' }}
          >
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}

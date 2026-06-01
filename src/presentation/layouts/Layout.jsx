import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu } from 'lucide-react';
import { useEffect } from 'react';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Cerrar sidebar al cambiar de ruta en móviles
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-layout">
      {/* Cabecera Móvil */}
      <div className="mobile-header">
        <div className="mobile-logo">GAD GIRÓN</div>
        <button onClick={() => setSidebarOpen(true)} style={{ color: 'var(--color-primary)' }}>
          <Menu size={28} />
        </button>
      </div>

      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

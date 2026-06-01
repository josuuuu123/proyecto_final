import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './presentation/context/AuthContext';
import Layout from './presentation/layouts/Layout';
import Dashboard from './presentation/pages/Dashboard';
import Busqueda from './presentation/pages/Busqueda';
import Multas from './presentation/pages/Multas';
import Pagos from './presentation/pages/Pagos';
import Apelaciones from './presentation/pages/Apelaciones';
import Login from './presentation/pages/Login';
import RecuperarContrasena from './presentation/pages/RecuperarContrasena';
import PoliceDashboard from './presentation/pages/PoliceDashboard';
import EmitirMulta from './presentation/pages/EmitirMulta';

// Componente para proteger rutas según el rol
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    // Si el usuario no tiene permiso, lo enviamos al inicio por defecto (que podría ser /busqueda para GUEST o /policia para POLICE)
    const fallbackRoute = user.rol === 'GUEST' ? '/busqueda' : (user.rol === 'POLICE' ? '/policia' : '/');
    return <Navigate to={fallbackRoute} replace />;
  }

  return children;
};

// Rutas de la aplicación
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.rol === 'GUEST' ? '/busqueda' : (user.rol === 'POLICE' ? '/policia' : '/')} replace /> : <Login />} />
      <Route path="/recuperar-contrasena" element={user ? <Navigate to={user.rol === 'GUEST' ? '/busqueda' : (user.rol === 'POLICE' ? '/policia' : '/')} replace /> : <RecuperarContrasena />} />
      
      {/* Rutas protegidas dentro del Layout */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        {/* Dashboard: ADMIN y CLIENT */}
        <Route 
          index 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'CLIENT']}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Búsqueda: GUEST, ADMIN, CLIENT */}
        <Route 
          path="busqueda" 
          element={
            <ProtectedRoute allowedRoles={['GUEST', 'ADMIN', 'CLIENT']}>
              <Busqueda />
            </ProtectedRoute>
          } 
        />
        
        {/* Multas/Historial: ADMIN, CLIENT */}
        <Route 
          path="multas" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'CLIENT']}>
              <Multas />
            </ProtectedRoute>
          } 
        />
        
        {/* Pagos: Solo CLIENT (El plan dice admin no, guest no) */}
        <Route 
          path="pagos" 
          element={
            <ProtectedRoute allowedRoles={['CLIENT']}>
              <Pagos />
            </ProtectedRoute>
          } 
        />
        
        {/* Apelaciones: ADMIN, CLIENT */}
        <Route 
          path="apelaciones" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'CLIENT']}>
              <Apelaciones />
            </ProtectedRoute>
          } 
        />
        
        {/* Dashboard de Policía */}
        <Route 
          path="policia" 
          element={
            <ProtectedRoute allowedRoles={['POLICE']}>
              <PoliceDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Formulario de Emitir Multa */}
        <Route 
          path="policia/emitir" 
          element={
            <ProtectedRoute allowedRoles={['POLICE']}>
              <EmitirMulta />
            </ProtectedRoute>
          } 
        />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

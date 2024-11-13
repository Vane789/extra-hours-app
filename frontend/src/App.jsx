import "./App.scss";
import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ExtraHoursMenu from "./components/ExtraHoursMenu";
import LoginPage from "./components/auth/LoginPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import ApprovePage from "./pages/ApprovePage";
import AddExtrahour from "./pages/AddExtrahour";
import PayExtraHoursPage from "./pages/PayExtraHoursPage";
import DeleteExtrahour from "./pages/DeleteExtrahour";
import { AuthProvider, AuthContext } from './components/context/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { auth, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(auth.role)) {
      return <Navigate to="/menu" replace />;
  }

  return children;
};

const ROUTE_ROLES = {
  '/add': ['USER', 'ADMIN'],
  '/reports': ['ADMIN'],
  '/approve-payroll': ['ADMIN'],
  '/update': ['ADMIN'],
  '/delete': ['ADMIN'],
  '/settings': ['ADMIN']
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route 
            path="/menu" 
            element={
              <ProtectedRoute roles={['USER', 'ADMIN']}>
                <ExtraHoursMenu />
              </ProtectedRoute>
            } 
          />

          {Object.entries(ROUTE_ROLES).map(([path, roles]) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute roles={roles}>
                  {(() => {
                    switch (path) {
                      case '/add': return <AddExtrahour />;
                      case '/reports': return <ReportsPage />;
                      case '/approve-payroll': return <ApprovePage />;
                      case '/update': return <PayExtraHoursPage />;
                      case '/delete': return <DeleteExtrahour />;
                      case '/settings': return <SettingsPage />;
                      default: return null;
                    }
                  })()}
                </ProtectedRoute>
              }
            />
          ))}

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

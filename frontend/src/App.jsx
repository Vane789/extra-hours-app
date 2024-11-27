import "./App.scss";
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ExtraHoursMenu from "./components/ExtraHoursMenu";
import LoginPage from "./components/auth/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import ApprovePage from "./pages/ApprovePage";
import AddExtrahour from "./pages/AddExtrahour";
import DeleteExtrahour from "./pages/DeleteExtrahour";
import { AuthProvider, AuthContext } from "./components/context/AuthContext";
import Footer from "./components/common/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.scss";

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
  "/add": ["USER", "ADMIN"],
  "/reports": ["ADMIN"],
  "/approve-payroll": ["ADMIN"],
  "/update": ["ADMIN"],
  "/delete": ["ADMIN"],
  "/settings": ["ADMIN"],
  "/profile": ["USER", "ADMIN"],
};

const routeComponents = {
  "/add": AddExtrahour,
  "/reports": ReportsPage,
  "/approve-payroll": ApprovePage,
  "/delete": DeleteExtrahour,
  "/settings": SettingsPage,
  "/profile": ProfilePage,
};

function App() {
  return (
    <>
      <ToastContainer />
      <AuthProvider>
        <div className="main-content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            <Route
              path="/menu"
              element={
                <ProtectedRoute roles={["USER", "ADMIN"]}>
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
                    {React.createElement(routeComponents[path])}
                  </ProtectedRoute>
                }
              />
            ))}

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </AuthProvider>
      <Footer />
    </>
  );
}

export default App;


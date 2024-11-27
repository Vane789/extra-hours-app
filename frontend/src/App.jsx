import "./App.scss";
import React from "react";
import {Routes, Route, Navigate } from "react-router-dom";
import ExtraHoursMenu from "./components/ExtraHoursMenu";
import LoginPage from "./components/auth/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import ApprovePage from "./pages/ApprovePage";
import AddExtrahour from "./pages/AddExtrahour";
import DeleteExtrahour from "./pages/DeleteExtrahour";
import HistoryPage from "./pages/HistoryPage";
import { AuthProvider, ProtectedRoute } from "./components/context/AuthContext";
import Footer from "./components/common/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.scss";

const ROUTE_ROLES = {
  "/add": ["USER", "ADMIN"],
  "/my-records": ["USER"],
  "/reports": ["ADMIN"],
  "/approve-payroll": ["ADMIN"],
  "/update": ["ADMIN"],
  "/delete": ["ADMIN"],
  "/settings": ["ADMIN"],
  "/profile": ["USER", "ADMIN"],
};

const routeComponents = {
  "/add": AddExtrahour,
  "/my-records": HistoryPage,
  "/reports": ReportsPage,
  "/approve-payroll": ApprovePage,
  "/delete": DeleteExtrahour,
  "/settings": SettingsPage,
  "/profile": ProfilePage,
};

function App() {
  return (
      <AuthProvider>
        <>
          <ToastContainer />
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
          <Footer />
        </>
      </AuthProvider>
  );
}

export default App;


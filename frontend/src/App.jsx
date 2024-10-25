import "./App.scss";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ExtraHoursMenu from "./components/ExtraHoursMenu";
import LoginPage from "./pages/LoginPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import ApprovePage from "./pages/ApprovePage";
import AddExtrahour from "./pages/AddExtrahour";
import PayExtraHoursPage from "./pages/PayExtraHoursPage";
import DeleteExtrahour from "./pages/DeleteExtrahour";
import { AuthProvider } from "./utils/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/menu" element={<ExtraHoursMenu />} />
          <Route
            path="/add"
            element={
              <ProtectedRoute
                allowedRoles={["empleado", "manager", "superusuario"]}
                element={<AddExtrahour />}
              />
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute
                allowedRoles={["manager", "superusuario"]}
                element={<ReportsPage />}
              />
            }
          />
          <Route
            path="/approve-payroll"
            element={
              <ProtectedRoute
                allowedRoles={["manager", "superusuario"]}
                element={<ApprovePage />}
              />
            }
          />
          <Route
            path="/update"
            element={
              <ProtectedRoute
                allowedRoles={["superusuario"]}
                element={<PayExtraHoursPage />}
              />
            }
          />
          <Route
            path="/delete"
            element={
              <ProtectedRoute
                allowedRoles={["superusuario"]}
                element={<DeleteExtrahour />}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute
                allowedRoles={["superusuario"]}
                element={<SettingsPage />}
              />
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

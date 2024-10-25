import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../utils/AuthContext";

// Componente para proteger las rutas
const ProtectedRoute = ({ element, allowedRoles }) => {
  const { auth } = useAuth();

  // Verificar si el ususario está autenticado y tiene un rol permitido
  if (!auth || !auth.role || !allowedRoles.includes(auth.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired, // 'element' debe ser un elemento React válido y obligatorio
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired, // 'allowedRoles' debe ser un array de strings y obligatorio
};

export default ProtectedRoute;

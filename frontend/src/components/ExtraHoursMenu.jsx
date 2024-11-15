import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import "./ExtraHoursMenu.scss";
import Pagar from "../assets/images/Pagar.png";
import Agregar from "../assets/images/Agregar.png";
import Configuracion from "../assets/images/Configuracion.png";
import Eliminar from "../assets/images/Eliminar.png";
import Informes from "../assets/images/Informes.png";
import NominaAprobar from "../assets/images/NominaAprobar.png";
import Cerrar from "../assets/images/Cerrar.png";

const ExtraHoursMenu = () => {
  const navigate = useNavigate();
  const { auth, logout } = useContext(AuthContext);

  const handleItemClick = (item) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const logoutAndRedirect = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    logout();
  };


  const MENU_ITEMS = {
    USER: [
      {
        icon: Agregar,
        text: "Agregar",
        path: "/add",
        id: "imgagregar"
      },
      {
        icon: Cerrar,
        text: "Cerrar Sesión",
        path: "#",
        id: "imgcerrar",
        onClick: logoutAndRedirect
      }
    ],
    ADMIN: [
      {
        icon: Agregar,
        text: "Agregar",
        path: "/add",
        id: "imgagregar"
      },
      {
        icon: Eliminar,
        text: "Actualizar - Eliminar",
        path: "/delete"
      },
      {
        icon: Informes,
        text: "Informes",
        path: "/reports"
      },
      {
        icon: NominaAprobar,
        text: "Nómina - Aprobar",
        path: "/approve-payroll"
      },
      {
        icon: Pagar,
        text: "Pagar",
        path: "/update"
      },
      {
        icon: Configuracion,
        text: "Configuración",
        path: "/settings"
      },
      {
        icon: Cerrar,
        text: "Cerrar Sesión",
        path: "#",
        id: "imgcerrar",
        onClick: logoutAndRedirect
      }
    ]
  };

  const renderMenuItems = () => {
    const roleItems = MENU_ITEMS[auth?.role] || [];
    
    return roleItems.map((item, index) => (
      <div 
        key={index}
        className="menu-item" 
        onClick={() => handleItemClick(item)}
      >
        <div id={item.id}>
          <img src={item.icon} alt={item.text} />
        </div>
        <p>{item.text}</p>
      </div>
    ));
  };

  return (
    <div className="extra-hours-wrapper">
      <div className="menu">
        <h1>Horas extras Amadeus</h1>
        <div className="grid">{renderMenuItems()}</div>
      </div>
    </div>
  );
};

export default ExtraHoursMenu;
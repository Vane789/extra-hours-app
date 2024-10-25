import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import "./ExtraHoursMenu.scss";
import Pagar from "../assets/images/Pagar.png";
import Agregar from "../assets/images/Agregar.png";
import Configuracion from "../assets/images/Configuracion.png";
import Eliminar from "../assets/images/Eliminar.png";
import Informes from "../assets/images/Informes.png";
import NominaAprobar from "../assets/images/NominaAprobar.png";

const ExtraHoursMenu = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  // Mostrar las opciones según el rol
  const renderMenuItems = () => {
    switch (auth?.role) {
      case "empleado":
        return (
          <>
            <div className="menu-item" onClick={() => navigate("/add")}>
              <div id="imgagregar">
                <img src={Agregar} alt="Agregar" />
              </div>
              <p>Agregar</p>
            </div>
          </>
        );

      case "manager":
        return (
          <>
            <div className="menu-item" onClick={() => navigate("/reports")}>
              <img src={Informes} alt="Informes" />
              <p>Informes</p>
            </div>
            <div
              className="menu-item"
              onClick={() => navigate("/approve-payroll")}
            >
              <img src={NominaAprobar} alt="Nómina - Aprobar" />
              <p>Nómina - Aprobar</p>
            </div>
          </>
        );

      case "superusuario":
        return (
          <>
            <div className="menu-item" onClick={() => navigate("/add")}>
              <div id="imgagregar">
                <img src={Agregar} alt="Agregar" />
              </div>
              <p>Agregar</p>
            </div>
            <div className="menu-item" onClick={() => navigate("/delete")}>
              <img src={Eliminar} alt="Eliminar" />
              <p>Actualizar - Eliminar</p>
            </div>
            <div className="menu-item" onClick={() => navigate("/reports")}>
              <img src={Informes} alt="Informes" />
              <p>Informes</p>
            </div>
            <div
              className="menu-item"
              onClick={() => navigate("/approve-payroll")}
            >
              <img src={NominaAprobar} alt="Nómina - Aprobar" />
              <p>Nómina - Aprobar</p>
            </div>
            <div className="menu-item" onClick={() => navigate("/update")}>
              <img src={Pagar} alt="Pagar" />
              <p>Pagar</p>
            </div>
            <div className="menu-item" onClick={() => navigate("/settings")}>
              <img src={Configuracion} alt="Configuración" />
              <p>Configuración</p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="menu">
        <h1>Horas extra Amadeus</h1>
        <div className="grid">{renderMenuItems()}</div>
      </div>
    </div>
  );
};

export default ExtraHoursMenu;

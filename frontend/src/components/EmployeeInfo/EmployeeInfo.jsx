import { Input } from "antd";
import { useState, useEffect } from "react";
import "./EmployeeInfo.scss";
const { Search } = Input;
import { findEmployee } from "@service/findEmployee";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

export const EmployeeInfo = ({ onIdChange, reset, setReset, setDataSearchingEmpleyee }) => {
  const [employee, setEmployee] = useState({});
  const [notFound, setNotFound] = useState();

  const onSearch = async (employeeId, event) => {
    if (event) event.preventDefault();
  
    try {
      const data = await findEmployee(employeeId);
      setEmployee(data);
      setNotFound(false);
      onIdChange(employeeId);
      setDataSearchingEmpleyee(data);
    } catch (error) {
      console.error(error);
  
      if (error.response && error.response.status === 404) {
        setNotFound(true);
      } else {
        toast.error("Empleado no encontrado, intente con otra cédula")
      }
  
      setEmployee({});
      setDataSearchingEmpleyee();
    }
  };

  useEffect(() => {
    if (reset) {
      setEmployee({});
      setNotFound(false);
      setReset(false);
    }
  }, [reset, setReset]);

  return (
    <div className="Info">
      <div className="search-container">
        <Search
          placeholder="Cédula"
          onSearch={(value, event) => onSearch(value, event)}
        />
        {notFound && (
          toast.error("Empleado no encontrado, intente con otra cédula")
        )}
      </div>

      {!!Object.keys(employee).length && (
        <div className="detailsInfo">
          <div className="description-item">
            <div className="title">Empleado</div>
            <div className="description">{employee.name}</div>
          </div>
          <div className="description-item">
            <div className="title">Salario</div>
            <div className="description">{employee.salary || "No especificado"}</div>
          </div>
          <div className="description-item">
            <div className="title">Cargo</div>
            <div className="description">{employee.position}</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Definir las validaciones de las propiedades
EmployeeInfo.propTypes = {
  onIdChange: PropTypes.func.isRequired,
  reset: PropTypes.bool.isRequired,
  setReset: PropTypes.func.isRequired,
};
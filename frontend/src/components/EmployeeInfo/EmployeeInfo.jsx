import { Input } from "antd";
import { useState, useEffect } from "react";
import "./EmployeeInfo.scss";
const { Search } = Input;
import { findEmployee } from "@service/findEmployee";
import PropTypes from "prop-types";

export const EmployeeInfo = ({ onIdChange, reset, setReset }) => {
  const [employee, setEmployee] = useState({});
  const [notFound, setNotFound] = useState();

  const onSearch = async (employeeId, event) => {
    if (event) event.preventDefault();

    console.log("onSearch called with employeeId:", employeeId);

    try {
      const data = await findEmployee(employeeId);

      setEmployee(data);
      setNotFound(false);
      console.log("Calling onIdChange with employeeId:", employeeId);
      onIdChange(employeeId);
    } catch (error) {
      console.error(error);
      setNotFound(true);
      setEmployee({});
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
<<<<<<< HEAD
    
=======
      

>>>>>>> c7ea2e68bded6d0fdc6f9172b8ba9fdaa8d94093
      {!!Object.keys(employee).length && (
        <div className="detailsInfo">
          <div className="description-item">
            <div className="title">Empleado</div>
            <div className="description">{employee.name}</div>
          </div>
          <div className="description-item">
            <div className="title">Salario</div>
            <div className="description">{employee.salary}</div>
          </div>
          <div className="description-item">
            <div className="title">Cargo</div>
            <div className="description">{employee.position}</div>
          </div>
          <div className="description-item">
            <div className="title">
              <br />
              Manager
            </div>
            <div className="description">{employee.manager}</div>
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

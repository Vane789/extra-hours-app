import { useState, useEffect } from "react";
import { Cascader } from "antd"; 
import { addExtraHour } from "@services/addExtraHour";
import { EmployeeInfo } from "../EmployeeInfo/EmployeeInfo";
import "./FormExtraHour.scss";
import { determineExtraHourType } from "@utils/extraHourCalculator";
import { toast } from 'react-toastify';

const options = [
  {
    value: "Server Patching Cycle",
    label: "Server Patching Cycle",
  },
  {
    value: "Zabbix, doker001",
    label: "Zabbix, doker001",
  },
  {
    value: "NICC-076817",
    label: "NICC-076817",
  },
];

const extraHourTypes = [
  { value: "diurnal", label: "Diurna (50%)" },
  { value: "nocturnal", label: "Nocturna (75%)" },
  { value: "diurnalHoliday", label: "Diurna Festiva (100%)" },
  { value: "nocturnalHoliday", label: "Nocturna Festiva (150%)" },
];

export const FormExtraHour = () => {
  const [extraHours, setExtraHours] = useState({
    registry: "",
    id: "",
    date: "",
    startTime: "",
    endTime: "",
    diurnal: 0,
    nocturnal: 0,
    diurnalHoliday: 0,
    nocturnalHoliday: 0,
    extrasHours: 0,
    observations: "",
    location: "", 
  });

  const [totalPayment, setTotalPayment] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resetEmployeeInfo, setResetEmployeeInfo] = useState(false);

  const handleIdChange = (id) => {
    setExtraHours((prevData) => ({
      ...prevData,
      id: parseInt(id, 10),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExtraHours((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Maneja los cambios del componente Cascader
  const handleCascaderChange = (value) => {
    setExtraHours((prevData) => ({
      ...prevData,
      location: value.join(" > "), // Une los valores seleccionados
    }));
  };

  const handleExtraHourTypeChange = (value) => {
    const percentage = {
      diurnal: 0.5,
      nocturnal: 0.75,
      diurnalHoliday: 1.0,
      nocturnalHoliday: 1.5,
    }[value[0]];

    setExtraHours((prevData) => ({
      ...prevData,
      extraHourType: value[0],
      extrasHours: calculateExtraHours(extraHours.startTime, extraHours.endTime) * percentage,
    }));
  };

  const calculateExtraHours = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const diff = (end - start) / (1000 * 60 * 60);
    return diff > 0 ? diff : 0;
  };

  // useEffect para calcular horas extra automáticamente cuando se cambian los tiempos
  useEffect(() => {
    if (extraHours.date && extraHours.startTime && extraHours.endTime) {
      determineExtraHourType(
        extraHours.date,
        extraHours.startTime,
        extraHours.endTime,
        setError,
        setExtraHours
      );
    }
  }, [extraHours.date, extraHours.startTime, extraHours.endTime]);

  useEffect(() => {
    if (extraHours.extrasHours) {
      const rate = 10; // Example rate per hour
      setTotalPayment(extraHours.extrasHours * rate);
    }
  }, [extraHours.extrasHours]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Asegurar el cálculo antes de enviar
    determineExtraHourType(
      extraHours.date,
      extraHours.startTime,
      extraHours.endTime,
      setError,
      setExtraHours
    );

    const body = {
      ...extraHours,
    };

    try {
      await addExtraHour(body);
      alert("Horas extras agregadas exitosamente");

      setExtraHours({
        registry: "",
        id: "",
        date: "",
        startTime: "",
        endTime: "",
        diurnal: 0,
        nocturnal: 0,
        diurnalHoliday: 0,
        nocturnalHoliday: 0,
        extrasHours: 0,
        observations: "",
        location: "",
      });

      setResetEmployeeInfo(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <EmployeeInfo
        onIdChange={handleIdChange}
        reset={resetEmployeeInfo}
        setReset={setResetEmployeeInfo}
      />
      <div className="form-group-date-time">
        <div>
          <label htmlFor="date">Fecha</label>
          <input
            type="date"
            id="date"
            name="date"
            value={extraHours.date}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="startTime">Hora de inicio</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={extraHours.startTime}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="endTime">Hora fin</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={extraHours.endTime}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="extra-hour-group">
        <div className="extra-hour-type">
          <label htmlFor="extraHourType">
            <h3 className="tittle">Tipo de Hora Extra</h3>
          </label>
          <Cascader
            options={extraHourTypes}
            onChange={handleExtraHourTypeChange}
            placeholder="Seleccione el tipo de hora extra"
          />
        </div>
        <div className="form-group-horizontal">
          <label htmlFor="extrasHours">
            <h3 className="tittle">Horas Extras</h3>
          </label>
          <input
            type="number"
            id="extrasHours"
            name="extrasHours"
            value={extraHours.extrasHours}
            readOnly
          />
        </div>
        <div className="total-payment">
          <label htmlFor="totalPayment">
            <h3 className="tittle">Total a Pagar</h3>
          </label>
          <input
            type="number"
            id="totalPayment"
            name="totalPayment"
            value={totalPayment}
            readOnly
          />
        </div>
      </div>
      <div className="incidente">
        <label htmlFor="cascader">
          <h3 className="tittle">Incidentes</h3></label>
        <Cascader
          options={options}
          onChange={handleCascaderChange}
          placeholder="Seleccione un incidente"
        />
      </div>
      <div className="observations">
        <label  htmlFor="observations">
          <h3 className="tittle">Observaciones</h3>
        </label>
        <textarea
          id="observations"
          name="observations"
          value={extraHours.observations}
          onChange={handleChange}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Agregar"}
      </button>
      {error && <p>Error: {error}</p>}
    </form>
  );
};

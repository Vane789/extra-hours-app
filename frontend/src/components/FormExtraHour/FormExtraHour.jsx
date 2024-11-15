import { useState, useEffect } from "react";
import { Cascader } from "antd"; // Importar correctamente el Cascader de antd
import { addExtraHour } from "@services/addExtraHour";
import { EmployeeInfo } from "../EmployeeInfo/EmployeeInfo";
import "./FormExtraHour.scss";
import { determineExtraHourType } from "@utils/extraHourCalculator";

const options = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake",
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua Men",
          },
        ],
      },
    ],
  },
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
    location: "", // Agregar un campo para almacenar la selección del cascader
  });

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
      <div className="form-group-horizontal">
        <label>Diurna</label>
        <input type="number" name="diurnal" value={extraHours.diurnal} step="0.01" readOnly />
        <label>Nocturna</label>
        <input type="number" name="nocturnal" value={extraHours.nocturnal} step="0.01" readOnly />
        <label>Diurna Festiva</label>
        <input type="number" name="diurnalHoliday" value={extraHours.diurnalHoliday} step="0.01" readOnly />
        <label>Nocturna Festiva</label>
        <input type="number" name="nocturnalHoliday" value={extraHours.nocturnalHoliday} step="0.01" readOnly />
      </div>
      <div>
        <label htmlFor="cascader">Ubicación</label>
        <Cascader
          options={options}
          onChange={handleCascaderChange}
          placeholder="Seleccione una ubicación"
        />
      </div>
      <div>
        <label className="observations" htmlFor="observations">
          <h3 className="observations">Observaciones</h3>
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

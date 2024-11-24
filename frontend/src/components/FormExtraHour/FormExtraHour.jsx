import { useState, useEffect } from "react";
import { Cascader } from "antd"; 
import { addExtraHour } from "@service/addExtraHour";
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
    id: "id-usuario",
    date: "",
    startime: "",
    endtime: "",
    extrahourtype: "",
    totalextrahour: 0,
    comments: "",
    incident: "",
    totalpayment: 0
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
    console.log("extrahours handleChange " , extraHours)
    console.log("handleChange name -< " , name)
    console.log("handleChange value -< " , value)
    setExtraHours((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Maneja los cambios del componente Cascader
  const handleCascaderChange = (value) => {
    setExtraHours((prevData) => ({
      ...prevData,
      incident: value.join(" > "), // Une los valores seleccionados
    }));
  };

  const getOptionsTypeHours = (value) => { 
    return {
      diurnal: {
        name: "diurnal",
        porcentage: 0.5
      },
      nocturnal: {
        name: "nocturnal",
        porcentage: 0.75
      },
      diurnalHoliday: {
        name: "diurnalHoliday",
        porcentage: 1.0
      },
      nocturnalHoliday: {
        name: "nocturnalHoliday",
        porcentage: 1.5
      },
    }[value[0]];
  }

  const handleExtraHourTypeChange = (value) => {
    setExtraHours((prevData) => {
      return {
        ...prevData,
        extrahourtype: getOptionsTypeHours(value).name,
        totalextrahour: calculateExtraHours(extraHours.startime, extraHours.endtime),
        totalpayment: calculateExtraHours(extraHours.startime, extraHours.endtime) * getOptionsTypeHours(value).porcentage * 20000
      }
    });
  };

  const calculateExtraHours = (startTime, endTime) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    const diffMinutes = endTotalMinutes - startTotalMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    const roundedHours = minutes > 30 ? hours + 1 : hours;
    console.log("roundedHours " , roundedHours)
    return roundedHours
  };

  // useEffect para calcular horas extra automáticamente cuando se cambian los tiempos
  useEffect(() => {
    if ( extraHours.startime && extraHours.endtime &&  extraHours.extrahourtype) {
      setExtraHours((prevData) => ({
        ...prevData,
        totalextrahour: calculateExtraHours(extraHours.startime, extraHours.endtime),
        totalpayment: calculateExtraHours(extraHours.startime, extraHours.endtime) * getOptionsTypeHours([extraHours.extrahourtype]).porcentage * 20000

      }));
    }
  }, [extraHours.startime, extraHours.endtime]);

  // useEffect(() => {
  //   if (extraHours.totalextrahour) {
  //     const rate = 10; // Example rate per hour
  //     setTotalPayment(extraHours.totalextrahour * rate);
  //   }
  // }, [extraHours.totalextrahour]);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log("informacion de todo el formulario --> "  , extraHours)
    // Asegurar el cálculo antes de enviar
    // determineExtraHourType(
    //   extraHours.date,
    //   extraHours.startTime,
    //   extraHours.endTime,
    //   setError,
    //   setExtraHours
    // );

    // const body = {
    //   ...totalextrahour,
    // };
    try {
      //await addExtraHour(body);
      toast.success("Horas extras agregadas exitosamente");

      // setExtraHours({
      //   date: "",
      //   startTime: "",
      //   endTime: "",
      //   hourTypes: "",
      //   extrasHours: 0,
      //   observations: "",
      //   incident: "",
      // });
  

      //setResetEmployeeInfo(true);
    } catch (error) {
      setError(error.message);
      toast.error(`Error: ${error.message}`);
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
            name="startime"
            value={extraHours.startTime}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="endTime">Hora fin</label>
          <input
            type="time"
            id="endTime"
            name="endtime"
            value={extraHours.endTime}
            onChange={handleChange}
          />
        </div>
      </div>
<<<<<<< HEAD
      <div className="form-group-horizontal">
        <label>Diurna</label>
        <input
          type="number"
          name="diurnal"
          value={extraHours.diurnal}
          step="0.01"
          readOnly
        />
        <label>Nocturna</label>
        <input
          type="number"
          name="nocturnal"
          value={extraHours.nocturnal}
          step="0.01"
          readOnly
        />
        <label>Diurna Festiva</label>
        <input
          type="number"
          name="diurnalHoliday"
          value={extraHours.diurnalHoliday}
          step="0.01"
          readOnly
        />
        <label>Nocturna Festiva</label>
        <input
          type="number"
          name="nocturnalHoliday"
          value={extraHours.nocturnalHoliday}
          step="0.01"
          readOnly
        />
       
=======
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
            name="totalextrahour"
            value={extraHours.totalextrahour}
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
            name="totalpayment"
            value={extraHours.totalpayment}
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
>>>>>>> c7ea2e68bded6d0fdc6f9172b8ba9fdaa8d94093
      </div>
      <div className="observations">
        <label  htmlFor="observations">
          <h3 className="tittle">Observaciones</h3>
        </label>
        <textarea
          id="observations"
          name="comments"
          value={extraHours.comments}
          onChange={handleChange}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Agregar"}
      </button>
    </form>
  );
};

import { useState, useEffect, useContext } from "react";
import { Cascader } from "antd"; 
import { addExtraHour } from "@service/addExtraHour";
import { getHoursType } from "@service/getHoursType";
import { EmployeeInfo } from "../EmployeeInfo/EmployeeInfo";
import "./FormExtraHour.scss";
import { extraHourCalculator } from "@utils/extraHourCalculator";
import { toast } from 'react-toastify';
import { AuthContext } from '../../components/context/AuthContext';

const options = [
  {
    value: "Server Patching Cycle",
    label: "Server Patching Cycle",
    id: 1
  },
  {
    value: "Zabbix, doker001",
    label: "Zabbix, doker001",
    id: 2
  },
  {
    value: "NICC-076817",
    label: "NICC-076817",
    id: 3
  },
];

// const extraHourTypes = [
//   { value: "diurnal", label: "Diurna (50%)" },
//   { value: "nocturnal", label: "Nocturna (75%)" },
//   { value: "diurnalHoliday", label: "Diurna Festiva (100%)" },
//   { value: "nocturnalHoliday", label: "Nocturna Festiva (150%)" },
// ];

export const FormExtraHour = () => {
  const [extraHours, setExtraHours] = useState({
    id: "",
    date: "",
    startime: "",
    endtime: "",
    extrahourtype: {},
    totalextrahour: 0,
    comments: "",
    incident: "",
    totalpayment: 0
  });

  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState(null);
  const [ resetEmployeeInfo, setResetEmployeeInfo ] = useState(false);
  const [ dataSearchingEmpleyee, setDataSearchingEmpleyee ] = useState();
  const [extraHourTypes, setExtraHourTypes] = useState([]); 

  const { auth } =  useContext(AuthContext);

  useEffect(() => {
    const fetchHourTypes = async () => {
      try {
        const data = await getHoursType();
        const formattedData = data.map(item => ({
          value: item.id.toString(),
          label: `${item.description} (${item.percentage}%)`,
          percentage: item.percentage,
          description: item.description
        }));
        setExtraHourTypes(formattedData);
      } catch (error) {
        console.error("Error al cargar los tipos de horas", error);
        toast.error("Error al cargar los tipos de horas");
      }
    };

    fetchHourTypes();
  }, []);

  console.log("auth ------------> " , auth.role)

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
    const incidentId = options.find( incident => incident.value == value[0]) 
    setExtraHours((prevData) => ({
      ...prevData,
      incident: incidentId.id, // Une los valores seleccionados
    }));
  };

  const getOptionsTypeHours = (value) => { 
    return {
      diurnal: {
        name: "diurnal",
        porcentage: 0.5,
        id: 1
      },
      nocturnal: {
        name: "nocturnal",
        porcentage: 0.75,
        id: 2
      },
      diurnalHoliday: {
        name: "diurnalHoliday",
        porcentage: 1.0,
        id: 3
      },
      nocturnalHoliday: {
        name: "nocturnalHoliday",
        porcentage: 1.5,
        id: 4
      },
    }[value[0]];
  }
  
  const handleExtraHourTypeChange = (value) => {
    const selectedType = extraHourTypes.find(type => type.value === value[0]);
    if (!selectedType) return;

    const totalHours = calculateExtraHours(extraHours.startime, extraHours.endtime);
    const payment = totalHours * (selectedType.percentage / 100) * 20000;

    setExtraHours(prevData => ({
      ...prevData,
      extrahourtype: {
        id: parseInt(selectedType.value),
        description: selectedType.description,
        percentage: selectedType.percentage
      },
      totalextrahour: totalHours,
      totalpayment: payment
    }));
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
    if (extraHours.startime && extraHours.endtime && extraHours.extrahourtype.id) {
      const totalHours = calculateExtraHours(extraHours.startime, extraHours.endtime);
      const payment = totalHours * (extraHours.extrahourtype.percentage / 100) * 20000;

      setExtraHours(prevData => ({
        ...prevData,
        totalextrahour: totalHours,
        totalpayment: payment
      }));
    }
  }, [extraHours.startime, extraHours.endtime]);

  // useEffect(() => {
  //   if (extraHours.totalextrahour) {
  //     const rate = 10; // Example rate per hour
  //     setTotalPayment(extraHours.totalextrahour * rate);
  //   }
  // }, [extraHours.totalextrahour]);

  useEffect(() => {

    console.log("test ----> " , dataSearchingEmpleyee)

  }, [dataSearchingEmpleyee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log("informacion de todo el formulario --> "  , extraHours)
    console.log("resetEmployeeInfo " , dataSearchingEmpleyee)
    if(dataSearchingEmpleyee) {
      console.log("Informacion de una persona como ADMIN ", dataSearchingEmpleyee)
    } else {
      console.log("No consulto a nadie")
    }
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
      if (!extraHours.date || !extraHours.startime || !extraHours.endtime || !extraHours.extrahourtype.id) {
        throw new Error("Por favor complete todos los campos requeridos");
      }
      await addExtraHour(extraHours, auth, dataSearchingEmpleyee );
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

  const isAdminOrManager = auth.role === 'ADMIN' || auth.role === 'MANAGER';

  return (
    <form onSubmit={handleSubmit}>
      {isAdminOrManager && (
      <EmployeeInfo
        onIdChange={handleIdChange}
        setDataSearchingEmpleyee = { setDataSearchingEmpleyee }
        reset={resetEmployeeInfo}
        setReset={setResetEmployeeInfo}
      />
      )}
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
      <button type="submit" disabled={loading || !dataSearchingEmpleyee && auth.role == "ADMIN"}>
        {loading ? "Enviando..." : "Agregar"}
      </button>
    </form>
  );
};

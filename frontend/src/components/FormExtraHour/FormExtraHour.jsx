import { useState, useEffect, useContext } from "react";
import { Cascader } from "antd"; 
import { addExtraHour } from "@service/addExtraHour";
import { getHoursType } from "@service/getHoursType";
import { getIncidents } from "@service/getIncidents";
import { EmployeeInfo } from "../EmployeeInfo/EmployeeInfo";
import "./FormExtraHour.scss";
// import { determineExtraHourType } from "@utils/extraHourCalculator";
import { toast } from 'react-toastify';
import { AuthContext } from '../../components/context/AuthContext';

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
  const [incidents, setIncidents] = useState([]);
  const [selectedPercentage, setSelectedPercentage] = useState();

  const { auth } =  useContext(AuthContext);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const data = await getIncidents();
        // Agregamos la opción null al inicio del array
        const formattedIncidents = [
          {
            value: '',
            label: 'Sin incidente'
          },
          ...data.map(incident => ({
            value: incident.id.toString(),
            label: incident.description,
          }))
        ];
        setIncidents(formattedIncidents);
      } catch (error) {
        console.error("Error al cargar los incidentes", error);
        toast.error("Error al cargar los incidentes");
      }
    };
  
    fetchIncidents();
  }, []);

  useEffect(() => {
    const fetchHourTypes = async () => {
      try {
        const data = await getHoursType();
        console.log("data ---> " , data)
        const formattedData = data.map(item => ({
          value: item.id.toString(),
          label: `${item.description} (${item.percentage}%)`,
        }));
        setExtraHourTypes(formattedData); 
      } catch (error) {
        console.error("Error al cargar los tipos de horas", error);
      }
    };

    fetchHourTypes();
  }, []);

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
      incident: value && value[0] ? parseInt(value[0], 10) : null, 
    }));
  };

  const handleExtraHourTypeChange = (value) => {

    const selectedType = extraHourTypes.find(type => type.value === value[0]);
    console.log("selectedType " , selectedType)
    const percentage = selectedType ? parseFloat(selectedType.label.match(/\(([^)]+)\)/)[1]) : 0;
    setSelectedPercentage(percentage)
    console.log("percentage " , percentage)
    console.log("extraHours.startime " , extraHours.startime)
    setExtraHours((prevData) => ({
      ...prevData,
      extrahourtype: selectedType.value,
      totalextrahour: calculateExtraHours(extraHours.startime, extraHours.endtime),
      totalpayment: getCalculatePayment(percentage)
    }));
  };

  const getCalculatePayment = (percentage) => {
      return (costPerHour()  * calculateExtraHours(extraHours.startime, extraHours.endtime) * (  1 + (percentage /100))).toFixed(0)
  }

  const calculateExtraHours = (startTime, endTime) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    const diffMinutes = endTotalMinutes - startTotalMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    const roundedHours = minutes > 30 ? hours + 1 : hours;
    return roundedHours
  };

  //useEffect para calcular horas extra automáticamente cuando se cambian los tiempos
  useEffect(() => {
    if ( extraHours.startime && extraHours.endtime && extraHours.totalpayment) {
      setExtraHours((prevData) => ({
        ...prevData,
        totalextrahour: calculateExtraHours(extraHours.startime, extraHours.endtime),
        totalpayment: getCalculatePayment(selectedPercentage)
      }));
    }
  }, [extraHours.startime, extraHours.endtime, selectedPercentage]);

  const costPerHour = ( ) => {
    const HOURS_PER_MONTH = 184; // se calcula por las horas legales semanales * 4 
    return auth.salary / HOURS_PER_MONTH;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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

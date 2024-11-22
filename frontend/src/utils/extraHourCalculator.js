// import Holiday from "date-holidays";

// const hd = new Holiday("CO");

export const determineExtraHourType = (
  date,
  startTime,
  endTime,
  setError,
  setExtraHours
) => {
  const startDateTime = new Date(`${date}T${startTime}`);
  const endDateTime = new Date(`${date}T${endTime}`);

  // Verificación para evitar que la hora de fin sea anterior a la de inicio
  if (endDateTime <= startDateTime) {
    setError("La hora de fin debe ser posterior a la hora de inicio.");
    return;
  }

  let current = new Date(startDateTime);
  let diurnal = 0,
    nocturnal = 0,
    diurnalHoliday = 0,
    nocturnalHoliday = 0;

  // Función para manejar horas extras según su tipo
  const handleExtraHours = (isHoliday, hoursDiff, isNight) => {
    if (isHoliday) {
      if (isNight) {
        nocturnalHoliday += hoursDiff; // Sumar a nocturnalHoliday
      } else {
        diurnalHoliday += hoursDiff; // Sumar a diurnalHoliday
      }
    } else {
      if (isNight) {
        nocturnal += hoursDiff; // Sumar a nocturnal
      } else {
        diurnal += hoursDiff; // Sumar a diurnal
      }
    }
  };

  // while (current < endDateTime) {
  //   // const isHoliday = hd.isHoliday(current) || current.getDay() === 0; // Verificar si la hora actual es festiva
  //   const hour = current.getHours();
  //   const minutes = current.getMinutes();
  //   const nextHour = new Date(current);
  //   nextHour.setHours(current.getHours() + 1);
  //   const actualEnd = nextHour > endDateTime ? endDateTime : nextHour;

  //   // Calcular la diferencia directamente en horas
  //   const hoursDiff = (actualEnd - current) / 1000 / 60 / 60;

  //   // Calcular horas diurnas (de 6:00 AM a 9:00 PM)
  //   if (hour >= 6 && hour < 21) {
  //     if (hour === 20) {
  //       // Si estamos entre las 8:00 PM y las 9:00 PM
  //       const remainingMinutes = 21 * 60 - (hour * 60 + minutes); // Minutos restantes hasta las 9:00 PM
  //       const remainingHours = remainingMinutes / 60; // Convertir minutos restantes a horas

  //       // handleExtraHours(isHoliday, remainingHours, false); // Sumar a diurna o festiva diurna
  //       const nocturnalHours = hoursDiff - remainingHours;
  //       if (nocturnalHours > 0) {
  //         handleExtraHours(isHoliday, nocturnalHours, true); // Sumar a nocturna o festiva nocturna
  //       }
  //     } else {
  //       handleExtraHours(isHoliday, hoursDiff, false); // Sumar horas diurnas
  //     }
  //   } else if (hour >= 21 || hour < 6) {
  //     if (hour < 6 && hour === 5) {
  //       const remainingMinutes = 6 * 60 - (hour * 60 + minutes);
  //       const remainingHours = remainingMinutes / 60;

  //       handleExtraHours(isHoliday, remainingHours, true); // Sumar a nocturna o festiva nocturna
  //       const diurnalHours = hoursDiff - remainingHours;
  //       if (diurnalHours > 0) {
  //         handleExtraHours(isHoliday, diurnalHours, false); // Sumar a diurna o festiva diurna
  //       }
  //     } else {
  //       handleExtraHours(isHoliday, hoursDiff, true); // Sumar horas nocturnas
  //     }
  //   }

  //   current = nextHour; // Avanzar a la siguiente hora
  // }

  const extrasHours = diurnal + nocturnal + diurnalHoliday + nocturnalHoliday;

  // Actualiza el estado con el valor redondeado a 2 decimales
  setExtraHours((prevData) => ({
    ...prevData,
    diurnal: diurnal.toFixed(2),
    nocturnal: nocturnal.toFixed(2),
    diurnalHoliday: diurnalHoliday.toFixed(2),
    nocturnalHoliday: nocturnalHoliday.toFixed(2),
    extrasHours: extrasHours.toFixed(2),
  }));
};

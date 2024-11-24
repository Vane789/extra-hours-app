// // extraHourCalculator.js

// import Holidays from 'date-holidays';

// const HOUR_IN_MINUTES = 60;
// const REGULAR_WORKDAY_START = '06:00';
// const REGULAR_WORKDAY_END = '21:00';
// const MINIMUM_EXTRA_MINUTES = 15;
// const WORKING_DAYS_PER_MONTH = 30;
// const WORKING_HOURS_PER_DAY = 8;

// const hd = new Holidays('CO');

// /**
//  * Calcula la tarifa por hora basada en el salario mensual
//  * @param {number} monthlySalary - Salario mensual del empleado
//  * @returns {number} Tarifa por hora
//  */
// const calculateHourlyRate = (monthlySalary) => {
//   return monthlySalary / (WORKING_DAYS_PER_MONTH * WORKING_HOURS_PER_DAY);
// };

// /**
//  * Convierte una hora en formato HH:mm a minutos
//  */
// const timeToMinutes = (time) => {
//   const [hours, minutes] = time.split(':').map(Number);
//   return hours * HOUR_IN_MINUTES + minutes;
// };

// /**
//  * Verifica si una hora está dentro del rango diurno (6:00 - 21:00)
//  */
// const isDaytime = (time) => {
//   const minutes = timeToMinutes(time);
//   return minutes >= timeToMinutes(REGULAR_WORKDAY_START) && 
//          minutes <= timeToMinutes(REGULAR_WORKDAY_END);
// };

// /**
//  * Verifica si una fecha es festivo o domingo
//  * @param {string} date - Fecha en formato YYYY-MM-DD
//  * @returns {boolean}
//  */
// const isHoliday = (date) => {
//   const dateObj = new Date(date);
//   // Verificar si es domingo (0 = domingo)
//   const isSunday = dateObj.getDay() === 0;
//   // Verificar si es festivo usando la librería
//   const isHolidayDate = hd.isHoliday(dateObj);
  
//   return isSunday || isHolidayDate;
// };

// /**
//  * Obtiene el nombre del festivo si aplica
//  * @param {string} date - Fecha en formato YYYY-MM-DD
//  * @returns {string|null}
//  */
// const getHolidayName = (date) => {
//   const dateObj = new Date(date);
//   const holiday = hd.isHoliday(dateObj);
//   if (holiday && holiday.length > 0) {
//     return holiday[0].name;
//   }
//   if (dateObj.getDay() === 0) {
//     return 'Domingo';
//   }
//   return null;
// };

// /**
//  * Redondea los minutos según la normativa
//  */
// const roundMinutes = (minutes) => {
//   if (minutes < MINIMUM_EXTRA_MINUTES) return 0;
//   if (minutes <= 45) return 30;
//   return HOUR_IN_MINUTES;
// };

// /**
//  * Valida los datos de entrada
//  */
// const validateInputs = (date, startTime, endTime) => {
//   const errors = [];
  
//   if (!date || !startTime || !endTime) {
//     errors.push('Todos los campos son obligatorios');
//   }

//   const start = timeToMinutes(startTime);
//   const end = timeToMinutes(endTime);
  
//   if (end <= start) {
//     errors.push('La hora de fin debe ser posterior a la hora de inicio');
//   }

//   const today = new Date();
//   const inputDate = new Date(date);
//   if (inputDate > today) {
//     errors.push('No se pueden registrar horas extras para fechas futuras');
//   }

//   // Validar máximo de horas extras según el tipo de día
//   const totalHours = (end - start) / HOUR_IN_MINUTES;
//   const maxHours = isHoliday(date) ? 12 : 10; // 12 horas en festivos, 10 en días normales
//   if (totalHours > maxHours) {
//     errors.push(`No se pueden registrar más de ${maxHours} horas extras por día`);
//   }

//   return errors;
// };

// /**
//  * Calcula el tipo de hora extra y su factor de multiplicación
//  */
// const calculateExtraHourFactor = (date, time, extraHourTypes) => {
//   const isDayTime = isDaytime(time);
//   const isHolidayDay = isHoliday(date);
  
//   return extraHourTypes.find(type => {
//     if (isDayTime && !isHolidayDay && type.label.includes('50%')) return true;
//     if (!isDayTime && !isHolidayDay && type.label.includes('75%')) return true;
//     if (isDayTime && isHolidayDay && type.label.includes('100%')) return true;
//     if (!isDayTime && isHolidayDay && type.label.includes('150%')) return true;
//     return false;
//   });
// };

// /**
//  * Calcula las horas extras y el pago correspondiente
//  * @param {string} startTime - Hora inicio (HH:mm)
//  * @param {string} endTime - Hora fin (HH:mm)
//  * @param {string} date - Fecha (YYYY-MM-DD)
//  * @param {number} monthlySalary - Salario mensual del empleado
//  * @param {Array} extraHourTypes - Tipos de horas extras
//  * @returns {Object} Resultado del cálculo
//  */
// export const calculateExtraHours = (startTime, endTime, date, monthlySalary, extraHourTypes) => {
//   // Validar inputs
//   const errors = validateInputs(date, startTime, endTime);
//   if (errors.length > 0) {
//     throw new Error(errors.join('. '));
//   }

//   if (!monthlySalary || monthlySalary <= 0) {
//     throw new Error('El salario base es requerido para el cálculo');
//   }

//   const startMinutes = timeToMinutes(startTime);
//   const endMinutes = timeToMinutes(endTime);
//   let totalMinutes = endMinutes - startMinutes;
  
//   // Redondear minutos según la normativa
//   totalMinutes = roundMinutes(totalMinutes);
//   const totalHours = totalMinutes / HOUR_IN_MINUTES;

//   // Calcular tarifa por hora
//   const hourlyRate = calculateHourlyRate(monthlySalary);

//   // Determinar el tipo de hora extra y factor
//   const extraHourType = calculateExtraHourFactor(date, startTime, extraHourTypes);
//   const percentage = parseFloat(extraHourType.label.match(/\(([^)]+)\)/)[1]) / 100;

//   // Calcular el pago
//   const basePayment = totalHours * hourlyRate;
//   const extraPayment = basePayment * (percentage - 1);
//   const totalPayment = basePayment + extraPayment;

//   // Obtener información del festivo si aplica
//   const holidayName = getHolidayName(date);

//   return {
//     hours: totalHours,
//     extraHourType,
//     payment: totalPayment,
//     details: {
//       isHoliday: isHoliday(date),
//       holidayName,
//       isDaytime: isDaytime(startTime),
//       percentage,
//       hourlyRate,
//       basePayment,
//       extraPayment
//     }
//   };
// };
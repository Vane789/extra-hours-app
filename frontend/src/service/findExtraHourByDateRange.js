export const findExtraHourByDateRange = async (startDate, endDate) => {
  try {
    const url = `http://localhost:4000/extra-hour?startDate=${startDate}&endDate=${endDate}`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

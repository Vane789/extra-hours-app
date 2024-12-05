import axios from 'axios';

export const getHoursType = async () => {
  const token = localStorage.getItem('token'); 

  try {
    const response = await axios.get(`https://extra-hours-app.onrender.com/hourtypes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error en getHoursType:", error);
    throw error;
  }
};

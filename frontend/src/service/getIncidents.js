import axios from 'axios';

export const getIncidents = async () => {
  const token = localStorage.getItem('token'); 

  try {
    const response = await axios.get(`http://localhost:8080/incidents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error en getIncidents:", error);
    throw error;
  }
};

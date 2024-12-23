import axios from 'axios';

export const deleteExtraHour = async (id) => {
  const token = localStorage.getItem('token'); 

  try {
    const response = await axios.delete(`https://extra-hours-app.onrender.com/extrahours/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error en deleteExtraHour:", error);
    throw error;
  }
};

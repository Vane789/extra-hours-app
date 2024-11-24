import axios from 'axios';

export const findEmployee = async (employeeId) => {
  const token = localStorage.getItem('token'); 

  try {
    const response = await axios.get(`http://localhost:8080/api/v1/admin/users/${employeeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.ourUsers;
  } catch (error) {
    console.error("Error en findEmployee:", error);
    throw error;
  }
};

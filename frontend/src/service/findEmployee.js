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

export const getExtraHoursReport = async () => {
  const token = localStorage.getItem('token'); 
  try {
    const response = await axios.get(`http://localhost:8080/extrahours/report`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener el reporte:', error);
    throw error;
  }
};

export const getPendingExtraHours = async () => {
  const token = localStorage.getItem('token'); 
  try {
    const response = await axios.get(`http://localhost:8080/extrahours/pending`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response,"response");
    return response.data;
   
  } catch (error) {
    console.error('Error fetching pending extra hours', error);
    throw error;
  }
};


export const approveExtraHours = async () => {
  const token = localStorage.getItem('token'); 
  try {
    const response = await axios.put(`http://localhost:8080/extrahours/approved`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
    console.log(response,"response");
    return response.data;
  } catch (error) {
    console.error('Error approving extra hours:', error);
    throw error;
  }
};

export const rejectExtraHours = async () => {
  const token = localStorage.getItem('token'); 
  try {
    const response = await axios.put(`http://localhost:8080/extrahours/rejected`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
    return response.data;
  } catch (error) {
    console.error('Error rejecting extra hours:', error);
    throw error;
  }
};


export const approveOrRejectExtraHour = async (id, approveRequestDTO) => {
  const token = localStorage.getItem('token');
  console.log("ID a enviar:", id); 
  console.log(approveRequestDTO, "approveRequestDTO");
  try {

    const idToSend = typeof id === 'object' ? id.id : id; 

    const response = await axios.post(
      `http://localhost:8080/extrahours/approve-or-reject/${idToSend}`,
      approveRequestDTO,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error approving or rejecting extra hour", error);
    throw error;
  }
};



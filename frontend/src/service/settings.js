import axios from "axios";

export const addHourType = async (hourType) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `http://localhost:8080/hourtypes`,
      hourType,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al añadir tipo de hora", error);
    throw error;
  }
};

export const createIncident  = async (incidentDTO) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `http://localhost:8080/incidents`,
        incidentDTO,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al añadir incidente", error);
      throw error;
    }
};

export const registerUser  = async (userData) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/auth/register`,
        userData,
        {
          headers: {
            "Content-Type": "application/json"
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al añadir usuario", error);
      throw error;
    }
};

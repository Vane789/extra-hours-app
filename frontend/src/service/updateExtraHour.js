import axios from "axios";

export const updateExtraHour = async (id, values) => {
  const token = localStorage.getItem("token");
  console.log("id ---> ", id);
  console.log("values ----> ", values);

  try {
    const response = await axios.put(
      `http://localhost:8080/extrahours/${id}`,
      values, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error en updateExtraHour:",
      error.response?.data || error.message
    );
    throw error;
  }
};

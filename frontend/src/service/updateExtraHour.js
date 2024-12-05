import axios from "axios";

export const updateExtraHour = async (id, values) => {
  const token = localStorage.getItem("token");
  console.log("id ---> ", id);
  console.log("values ----> ", values);

  try {
    const response = await axios.put(
      `https://extra-hours-app.onrender.com/extrahours/${id}`,
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

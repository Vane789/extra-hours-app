export const findEmployee = async (id) => {
  try {
    const response = await fetch(`http://localhost:4000/employee-info/${id}`);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

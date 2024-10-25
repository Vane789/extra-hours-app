export const updateExtraHour = async (registry, body) => {
  try {
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(
      `http://localhost:4000/extra-hour/${registry}`,
      options
    );

    if (!response.ok) {
      throw new Error(
        `Error al actualizar la hora extra: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al actualizar la hora extra:", error);

    throw error;
  }
};

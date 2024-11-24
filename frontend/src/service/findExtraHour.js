export const findExtraHour = async (identifier, type = "registry") => {
  try {
    const url =
      type === "id"
        ? `http://localhost:4000/extra-hour/id/${identifier}`
        : `http://localhost:4000/extra-hour/${identifier}`;

    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

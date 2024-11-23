export const addExtraHour = async (body, context) => {

  const payload  = {
    date: body.date,
    startime: body.startime,
    endtime: body.endtime,
    comments: body.comments,
    totalextrahour: body.totalextrahour,
    totalpayment: body.totalpayment,
    identification: context.identification,
    extrahourtype: body.extrahourtype.id,
    incidentId: body.incident
  }

  console.log("token " + context.token)

  try {
    const options = {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${context.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    console.log("Enviando datos:", payload);

    const response = await fetch(
      `http://localhost:8080/extrahours`,
      options
    );

    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error al agregar horas extra:", error);

    throw error;
  }
};

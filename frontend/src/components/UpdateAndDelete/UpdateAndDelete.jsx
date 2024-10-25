import { useState } from "react";
import { Input, Table, Button, Modal, Form, InputNumber, message } from "antd";
import { findEmployee } from "@services/findEmployee";
import { findExtraHour } from "@services/findExtraHour";
import { updateExtraHour } from "@services/updateExtraHour";
import { deleteExtraHour } from "../../services/deleteExtraHour";
import { columns as staticColumns } from "@utils/tableColumns";
import "./UpdateAndDelete.scss";

export const UpdateAndDelete = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSearch = async (idOrRegistry) => {
    const numericIdOrRegistry = parseInt(idOrRegistry, 10);
    setLoading(true);
    setError(null);

    try {
      const employee = await findEmployee(numericIdOrRegistry);
      const extraHours = await findExtraHour(numericIdOrRegistry, "id");

      if (!extraHours.length) {
        const extraHourByRegistry = await findExtraHour(
          numericIdOrRegistry,
          "registry"
        );
        setEmployeeData(
          extraHourByRegistry.map((extraHour) => ({
            ...extraHour,
            ...employee,
          }))
        );
      } else {
        setEmployeeData(
          extraHours.map((extraHour) => ({ ...extraHour, ...employee }))
        );
      }
    } catch (error) {
      setError("No se encontraron datos para el ID ingresado.");
      setEmployeeData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "¿Estás seguro que deseas eliminar este registro?",
      onOk: async () => {
        try {
          await deleteExtraHour(record.registry);

          setEmployeeData((prevData) =>
            prevData.filter((item) => item.registry !== record.registry)
          );

          message.success("Registro eliminado exitosamente");
        } catch (error) {
          message.error("Error al eliminar el registro");
        }
      },
    });
  };

  const handleUpdate = (record) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const handleSave = async (values) => {
    try {
      if (!selectedRow) {
        throw new Error("No hay un registro seleccionado para actualizar.");
      }

      const registry = selectedRow.registry;

      const updatedValues = {
        ...values,
        diurnal: Number(values.diurnal),
        nocturnal: Number(values.nocturnal),
        diurnalHoliday: Number(values.diurnalHoliday),
        nocturnalHoliday: Number(values.nocturnalHoliday),
        extrasHours:
          Number(values.diurnal) +
          Number(values.nocturnal) +
          Number(values.diurnalHoliday) +
          Number(values.nocturnalHoliday),
      };

      console.log("Datos a actualizar:", updatedValues);

      const updatedData = employeeData.map((item) =>
        item.registry === registry ? { ...item, ...updatedValues } : item
      );
      setEmployeeData(updatedData);

      const response = await updateExtraHour(registry, updatedValues);

      console.log("Respuesta de la API:", response);

      message.success("Registro actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar:", error);
      message.error("Error al actualizar el registro");
    } finally {
      setIsModalVisible(false);
    }
  };

  const handleFormChange = (changedFields) => {
    const { diurnal, nocturnal, diurnalHoliday, nocturnalHoliday } =
      changedFields;

    const totalExtraHours =
      (diurnal || selectedRow?.diurnal || 0) +
      (nocturnal || selectedRow?.nocturnal || 0) +
      (diurnalHoliday || selectedRow?.diurnalHoliday || 0) +
      (nocturnalHoliday || selectedRow?.nocturnalHoliday || 0);

    setSelectedRow((prev) => ({
      ...prev,
      extrasHours: totalExtraHours,
    }));
  };

  const actionColumn = {
    title: "Acciones",
    key: "actions",
    render: (text, record) => (
      <span>
        <Button
          type="link"
          onClick={() => handleUpdate(record)}
          style={{ marginRight: 8 }}
        >
          Editar
        </Button>
        <Button type="link" onClick={() => handleDelete(record)}>
          Eliminar
        </Button>
      </span>
    ),
  };

  const columns = [...staticColumns, actionColumn]; // Combina las columnas

  return (
    <div className="ReportInfo">
      <div className="search-container">
        <Input.Search
          placeholder="Ingrese ID del empleado"
          onSearch={handleSearch}
        />
        {error && <p className="error-message">{error}</p>}
      </div>

      {loading && <p>Cargando datos...</p>}

      {employeeData.length > 0 && (
        <div className="extra-hours-info">
          <h3>Registros de Horas Extras</h3>
          <Table
            columns={columns}
            dataSource={employeeData}
            rowKey="registry"
            pagination={false}
            scroll={{
              x: 900,
              y: 500,
            }}
          />
        </div>
      )}

      {isModalVisible && (
        <Modal
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <div className="modal__container">
            <header>
              <h2>Actualizar registro</h2>
            </header>
            <Form
              initialValues={selectedRow}
              onFinish={handleSave}
              onValuesChange={handleFormChange}
            >
              <Form.Item name="diurnal" label="Diurnas">
                <InputNumber />
              </Form.Item>
              <Form.Item name="nocturnal" label="Nocturnas">
                <InputNumber />
              </Form.Item>
              <Form.Item name="diurnalHoliday" label="Diurnas Festivas">
                <InputNumber />
              </Form.Item>
              <Form.Item name="nocturnalHoliday" label="Nocturnas Festivas">
                <InputNumber />
              </Form.Item>
              <Form.Item name="extrasHours" label="Total Horas Extras">
                <InputNumber value={selectedRow?.extrasHours} disabled />
              </Form.Item>
              <Form.Item name="date" label="Date">
                <Input />
              </Form.Item>
              <Form.Item name="observations" label="Observaciones">
                <Input />
              </Form.Item>
              <Form.Item>
                <Button className="button" type="primary" htmlType="submit">
                  Guardar
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>
      )}
    </div>
  );
};

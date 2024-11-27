import { useState, useEffect } from "react";
import {
  Input,
  Table,
  Card,
  Button,
  Modal,
  Form,
  message,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  // FilterOutlined,
  EditOutlined,
  DeleteTwoTone,
  DeleteOutlined,
  // ReloadOutlined
} from "@ant-design/icons";
import { getExtraHoursReport } from "@service/findEmployee";
// import { findEmployee } from "@service/findEmployee";
// import { findExtraHour } from "@service/findExtraHour";
import { updateExtraHour } from "@service/updateExtraHour";
import { deleteExtraHour } from "@service/deleteExtraHour";
// import { getHoursType } from "@service/getHoursType";
// import { getIncidents } from "@service/getIncidents";
import { columns as staticColumns } from "@utils/tableColumns";
import "./UpdateAndDelete.scss";
import { toast } from "react-toastify";

export const UpdateAndDelete = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  // const [extraHourTypes, setExtraHourTypes] = useState([]);
  // const [incidents, setIncidents] = useState([]);

  // useEffect(() => {
  //   const fetchIncidents = async () => {
  //     try {
  //       const data = await getIncidents();
  //       // Agregamos la opción null al inicio del array
  //       const formattedIncidents = [
  //         {
  //           value: '',
  //           label: 'Sin incidente'
  //         },
  //         ...data.map(incident => ({
  //           value: incident.id.toString(),
  //           label: incident.description,
  //         }))
  //       ];
  //       console.log("data incidents ----> " , data)
  //       setIncidents(formattedIncidents);
  //     } catch (error) {
  //       console.error("Error al cargar los incidentes", error);
  //       toast.error("Error al cargar los incidentes");
  //     }
  //   };

  //   fetchIncidents();
  // }, []);

  // useEffect(() => {
  //   const fetchHourTypes = async () => {
  //     try {
  //       const data = await getHoursType();
  //       console.log("data ---> " , data)
  //       const formattedData = data.map(item => ({
  //         value: item.id.toString(),
  //         label: `${item.description} (${item.percentage}%)`,
  //       }));
  //       console.log("data fetchHourTypes ----> " , data)
  //       setExtraHourTypes(formattedData);
  //     } catch (error) {
  //       console.error("Error al cargar los tipos de horas", error);
  //     }
  //   };

  //   fetchHourTypes();
  // }, []);

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  console.log(filteredData, "filteredData");

  const fetchEmployeeData = async () => {
    setLoading(true);
    try {
      const response = await getExtraHoursReport();
      console.log("response ----> ", response);
      if (response.length === 0) {
        message.warning("No se encontraron registros.");
      } else {
        setEmployeeData(response);
        setFilteredData(response);
      }
    } catch (err) {
      message.error("Error al cargar los datos iniciales.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value) {
      const filtered = employeeData.filter((item) =>
        item.identification
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(employeeData);
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "¿Estás seguro que deseas eliminar este registro?",
      onOk: async () => {
        try {
          console.log("record ---> ", record);
          await deleteExtraHour(record.id.toString());

          setEmployeeData((prevData) =>
            prevData.filter((item) => item.id !== record.id)
          );
          setFilteredData((prevData) =>
            prevData.filter((item) => item.id !== record.id)
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

  useEffect(() => {
    console.log("isModalVisible ---> ", isModalVisible);
    console.log("selectedRow ---> ", selectedRow);
  }, [isModalVisible]);

  const handleSave = async (values) => {
    console.log("values ----> handleSave", values);
    try {
      if (!selectedRow) {
        throw new Error("No hay un registro seleccionado para actualizar.");
      }

      const updatedValues = {
        ...values,
      };

      console.log("Datos a actualizar:", updatedValues);

      const updatedData = employeeData.map((item) =>
        item.id === values.id ? { ...item, ...updatedValues } : item
      );

      console.log("updatedData ---> ", updatedData);
      setEmployeeData(updatedData);
      setFilteredData(updatedData);
      const response = await updateExtraHour(values.id, updatedValues);

      console.log("Respuesta de la API:", response);

      message.success("Registro actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar:", error);
      message.error("Error al actualizar el registro");
    } finally {
      setIsModalVisible(false);
    }
  };

  const actionColumn = {
    title: "Acciones",
    key: "actions",
    align: "center",
    render: (text, record) => (
      <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
        <Tooltip title="Editar Registro">
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => handleUpdate(record)}
          />
        </Tooltip>
        <Tooltip title="Eliminar Registro">
          <Button
            type="primary"
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </Tooltip>
      </div>
    ),
  };

  const columns = [...staticColumns, actionColumn];

  return (
    <Card
      title="Gestión de Horas Extras"
      style={{ margin: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
    >
      <div className="filters-container">
        <Input.Search
          prefix={<SearchOutlined />}
          placeholder="Buscar por ID de empleado"
          value={searchValue}
          onChange={handleSearch}
          style={{ width: 250, marginRight: 10 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="identification"
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          defaultPageSize: 10,
          pageSizeOptions: [10, 20, 50, 100],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} de ${total} registros`,
        }}
        scroll={{ x: 1200, y: 500 }}
        style={{ marginTop: 20 }}
      />

      {isModalVisible && (
        <Modal
          className="update-modal"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          title="Actualizar Registro"
          centered
        >
          <Form
            initialValues={selectedRow}
            onFinish={handleSave}
            layout="vertical"
            className="update-modal-form"
          >
             <Form.Item 
          name="id" 
          label="ID" 
          className="update-modal-form-item"
        >
          <Input disabled />
        </Form.Item>
        
        <Form.Item 
          name="incident" 
          label="Incidente" 
          className="update-modal-form-item"
        >
          <Input placeholder="Describa el incidente" />
        </Form.Item>
        
        <Form.Item 
          name="comments" 
          label="Observaciones" 
          className="update-modal-form-item"
        >
          <Input.TextArea 
            rows={3} 
            placeholder="Comentarios adicionales" 
          />
        </Form.Item>
        
        <Form.Item className="update-modal-form-button">
          <Button 
            type="primary" 
            htmlType="submit"
            block
            icon={<EditOutlined />}
            size="large"
          >
            Guardar Cambios
          </Button>
        </Form.Item>
      </Form>
    </Modal>
      )}
    </Card>
  );
};

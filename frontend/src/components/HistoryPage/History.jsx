import React, { useEffect, useState } from "react";
import { Table, Tag, Spin, Modal, Button, Alert, Tooltip, Card } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

export const History = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const identification = localStorage.getItem("identification");

    try {
      const response = await axios.get(
        `http://localhost:8080/extrahours/history?identification=${identification}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);
    } catch (err) {
      setError("Error fetching history");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteExtraHour = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(
        `http://localhost:8080/extrahours/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 204) {
        // Eliminar el item de la lista localmente
        setData((prevData) => prevData.filter((item) => item.id !== id));
        Modal.success({
          content: "La hora extra ha sido eliminada correctamente.",
        });
      }
    } catch (err) {
      Modal.error({
        content: "Hubo un error al intentar eliminar la hora extra.",
      });
      console.error(err);
    }
  };

  const handleDelete = () => {
    if (selectedId) {
      deleteExtraHour(selectedId);
      setIsModalVisible(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const columns = [
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Incidente",
      dataIndex: "incident",
      key: "incident",
    },
    {
      title: "Horas Extra",
      dataIndex: "totalExtraHour",
      key: "totalExtraHour",
      render: (value) => `${value} hrs`,
    },
    {
      title: "Pago Total",
      dataIndex: "totalPayment",
      key: "totalPayment",
      render: (value) => `$${value}`,
    },
    {
      title: "Estado",
      dataIndex: "approvalStatus",
      key: "approvalStatus",
      render: (status) => {
        let color = "default";
        if (status === "APPROVED") color = "green";
        else if (status === "PENDING") color = "orange";
        else if (status === "REJECTED") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Aprobado/Rechazado Por",
      dataIndex: "approvedByUserIdentification",
      key: "approvedByUserIdentification",
      render: (value) => (value ? value : ""),
    },
    {
      title: "Comentarios",
      dataIndex: "comments",
      key: "comments",
    },
    {
      title: "Acciones",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Tooltip title="Eliminar Registro">
          <Button
            type="primary"
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedId(record.id);
              setIsModalVisible(true);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Card
      title="Historial de Horas Extras"
      style={{ margin: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
    >
      {loading ? (
        <Spin tip="Cargando historial..." />
      ) : error ? (
        <Alert message={error} type="error" />
      ) : (
        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
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
      )}
      {isModalVisible && (
        <Modal
          title="Confirmar Eliminación"
          open={isModalVisible}
          onOk={handleDelete}
          onCancel={() => setIsModalVisible(false)}
          okText="Eliminar"
          cancelText="Cancelar"
        >
          <p>¿Estás seguro de que deseas eliminar esta hora extra?</p>
        </Modal>
      )}
    </Card>
  );
};

export default History;

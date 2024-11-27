import React, { useState, useEffect, useCallback } from "react";
import { 
  Input, 
  Table, 
  Card, 
  Button, 
  message, 
  Tag,
  Tooltip
} from "antd";
import { 
  SearchOutlined, 
  CheckOutlined, 
  CloseOutlined 
} from "@ant-design/icons";
import { getPendingExtraHours, approveOrRejectExtraHour } from "@service/findEmployee";
import "./Approve.scss";

export const Approve = () => {
  const [extraHoursData, setExtraHoursData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem('authToken');
  const approverIdentification = localStorage.getItem('identification');

  const handleExtraHoursAction = async (id, action) => {
    if (!approverIdentification) {
      alert("No se ha encontrado identificación en el localStorage");
      return;
    }
    try {
      const approveRequestDTO = {
        approverIdentification: approverIdentification,
        action: action,
        requestDate: new Date(),
      };

      await approveOrRejectExtraHour(id, approveRequestDTO);
      message.success(`Horas extra ${action === 'approve' ? 'aprobadas' : 'rechazadas'} con éxito`);
      fetchExtraHours();
    } catch (error) {
      message.error(`Error: ${error.message}`);
    }
  };
    

  const fetchExtraHours = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getPendingExtraHours(token);
      setExtraHoursData(response);
      setFilteredData(response);
    } catch (error) {
      message.error("Error al cargar las horas extra");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchExtraHours();
  }, [fetchExtraHours]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = extraHoursData.filter((item) =>
      item.identification.toString().toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const columns = [
    { 
      title: 'Identificación', 
      dataIndex: 'identification',
      width: 120 
    },
    { 
      title: 'Nombre', 
      dataIndex: 'name',
      width: 150 
    },
    { 
      title: 'Incidente', 
      dataIndex: 'incident',
      width: 100 
    },
    { 
      title: 'Descripción incidente', 
      dataIndex: 'comments',
      width: 200 
    },
    { 
      title: 'Fecha', 
      dataIndex: 'date',
      width: 100 
    },
    { 
      title: 'Horas Extras', 
      dataIndex: 'totalExtraHour', 
      render: (value) => `${value} hrs`,
      width: 50
    },
    { 
      title: 'Estado', 
      dataIndex: 'approvalStatus', 
      render: (status) => (
        <Tag 
          color={status === 'PENDING' ? 'orange' : status === 'APPROVED' ? 'green' : 'red'}
        >
          {status}
        </Tag>
      ),
      width: 60
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        record.approvalStatus === 'PENDING' && (
          <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
            <Tooltip title="Aprobar">
              <Button
                type="primary"
                shape="circle"
                icon={<CheckOutlined />}
                onClick={() => handleExtraHoursAction(record, 'approve')}
              />
            </Tooltip>
            <Tooltip title="Rechazar">
              <Button
                type="primary"
                shape="circle"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleExtraHoursAction(record, 'reject')}
              />
            </Tooltip>
          </div>
        )
      )
    }
  ];

  return (
    <Card
      title="Aprobación de Horas Extras"
      style={{ margin: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
    >
      <div className="filters-container">
        <Input.Search
          prefix={<SearchOutlined />}
          placeholder="Buscar por ID de empleado"
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: 250, marginRight: 10 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
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
    </Card>
  );
};
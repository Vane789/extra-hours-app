import { useState, useEffect } from "react";
import {
  Input,
  Table,
  // DatePicker,
  Card,
  Button,
  message,
  Modal,
} from "antd";
import {
  SearchOutlined,
  FileExcelOutlined,
  FilterOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { getExtraHoursReport } from "@service/findEmployee";
// import { findExtraHour } from "@service/findExtraHour";
// import { findExtraHourByDateRange } from "@service/findExtraHourByDateRange";
import ExcelJS from "exceljs";
import { columns } from "@utils/tableColumns";
import "./ReportInfo.scss";
import axios from "axios";
// import { toast } from "react-toastify";
// import { Spin } from "antd";

// const { RangePicker } = DatePicker;

export const ReportInfo = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [email, setEmail] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [error, setError] = useState(null);
  // const [selectedRange, setSelectedRange] = useState([]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEmail("");
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    setLoading(true);
    try {
      const response = await getExtraHoursReport();

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

  const handleSearchChange = (e) => {
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
  // } else if (selectedRange.length === 2) {
  //   const [startDate, endDate] = selectedRange;
  //   data = await get(
  //     startDate.format("YYYY-MM-DD"),
  //     endDate.format("YYYY-MM-DD")
  //   );

  //     if (data.length > 0) {
  //       setEmployeeData(data);
  //     } else {
  //       toast.error(
  //         "No se encontraron datos para los criterios de búsqueda proporcionados."
  //       );
  //       setEmployeeData([]);
  //     }
  //   } catch (error) {
  //     toast.error("Error al buscar los datos. Por favor, intente nuevamente.");
  //     setEmployeeData([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleExport = async () => {
    try {
      const xlsBuffer = await generateXLS(employeeData);
      const blob = new Blob([xlsBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Reporte_Horas_Extras_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      link.click();
    } catch (error) {
      console.error("Error al exportar el archivo Excel", error);
    }
  };

  const handleSendEmail = async () => {
    const token = localStorage.getItem("token");
    if (!email) {
      message.error("Por favor, ingrese un correo electrónico.");
      return;
    }

    setLoadingEmail(true);

    try {
      const fileBuffer = await generateXLS(employeeData);
      const base64File = btoa(
        new Uint8Array(fileBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      const response = await axios.post(
        "http://localhost:8080/api/send-email",
        {
          email,
          file: base64File,
        },
        { 
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        message.success("Correo enviado con éxito.");
        handleCancel();
      }
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      message.error("Error al enviar el correo. Intente nuevamente.");
    } finally {
      setLoadingEmail(false);
    }
  };

  const generateXLS = async (data) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Reporte Horas Extras");
      worksheet.columns = [
        { header: "ID", key: "identification", width: 15 },
        { header: "Nombre completo", key: "name", width: 30 },
        { header: "Nombre del incidente", key: "incident", width: 15 },
        { header: "Observaciones", key: "comments", width: 30 },
        { header: "Fecha", key: "date", width: 30 },
        { header: "Hora de inicio", key: "startTime", width: 15 },
        { header: "Hora de fin", key: "endTime", width: 10 },
        { header: "Tipo de Hora Extra", key: "extraHourType", width: 10 },
        { header: "Total Horas Extras", key: "totalExtraHour", width: 10 },
        { header: "Total a pagar", key: "totalPayment", width: 15 },
      ];

      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "0070C0" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      data.forEach((task, index) => {
        const row = worksheet.addRow(task);

        // Alternar colores en las filas
        const fillColor = index % 2 === 0 ? "D9E2F3" : "FFFFFF"; // Azul claro y blanco
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: fillColor },
          };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.alignment = { horizontal: "left", vertical: "middle" };
        });
      });

      worksheet.columns.forEach((column) => {
        const maxLength = column.header.length;
        column.width = Math.max(column.width, maxLength + 5);
      });

      return workbook.xlsx.writeBuffer();
    } catch (err) {
      console.error("Error al generar el archivo Excel:", err);
      throw new Error("Error generating XLS file");
    }
  };

  return (
    <Card
      title="Reporte de Horas Extras"
      extra={
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={handleExport}
            disabled={filteredData.length === 0}
          >
            Exportar
          </Button>
          <Button type="primary" icon={<MailOutlined />} onClick={showModal}>
            Enviar por Correo
          </Button>
        </div>
      }
      style={{ margin: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
    >
      <div className="filters-container">
        <Input.Search
          prefix={<SearchOutlined />}
          placeholder="Buscar por ID de empleado"
          value={searchValue}
          onChange={handleSearchChange}
          style={{ width: 250, marginRight: 10 }}
        />

        {/* <RangePicker 
          onChange={handleDateRangeChange}
          style={{ marginRight: 10 }}
        /> */}

        <Button icon={<FilterOutlined />} onClick={fetchEmployeeData}>
          Recargar
        </Button>
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
      <Modal
        title="Enviar Reporte por Correo"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Input
          placeholder="Ingrese el correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: 15 }}
        />
        <Button
          type="primary"
          loading={loadingEmail}
          onClick={handleSendEmail}
          style={{ width: "100%" }}
        >
          Enviar
        </Button>
      </Modal>
    </Card>
  );
};
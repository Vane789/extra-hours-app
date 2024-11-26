import { useState } from "react";
import { Input, Table, DatePicker } from "antd";
import { getExtraHoursReport } from "@service/findEmployee";
// import { findExtraHour } from "@service/findExtraHour";
// import { findExtraHourByDateRange } from "@service/findExtraHourByDateRange";
import ExcelJS from "exceljs";
import { columns } from "@utils/tableColumns";
import "./ReportInfo.scss";
import { toast } from "react-toastify";
import { Spin } from "antd";

const { RangePicker } = DatePicker;

export const ReportInfo = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRange, setSelectedRange] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    if (!searchValue) {
      toast.error("Por favor, ingrese un ID válido.");
      setLoading(false);
      return;
    }

    try {
      const response = await getExtraHoursReport(searchValue);
      if (response.length === 0) {
        toast.error("No se encontraron registros para este ID.");
        setEmployeeData([]);
      } else {
        setEmployeeData(response);
      }
    } catch (err) {
      toast.error("Error al buscar los datos. Por favor, intente nuevamente.");
      setEmployeeData([]);
    } finally {
      setLoading(false);
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
      link.download = "data.xls";
      link.click();
    } catch (error) {
      console.error("Error generating XLS file:", error);
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
    <div className="ReportInfo">
      <div className="filters-container">
        <div className="search-container">
          <Input.Search
            placeholder="Ingrese ID del empleado"
            onSearch={handleSearch}
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
        </div>
        <div className="range-picker-container">
          <RangePicker onChange={(dates) => setSelectedRange(dates)} />
          <button onClick={handleSearch} style={{ marginLeft: 10 }}>
            Buscar
          </button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading && (
        <div className="loading-container">
          <Spin tip="Cargando datos..." />
        </div>
      )}

      {employeeData.length > 0 && (
        <div className="extra-hours-info">
          <h3>Registros de Horas Extras</h3>
          <Table
            columns={columns}
            dataSource={employeeData}
            rowKey="identification"
            pagination={false}
            scroll={{
              x: 1200,
              y: 800,
            }}
          />
        </div>
      )}
      <button className="boton" onClick={handleExport}>
        Exportar a Excel
      </button>
    </div>
  );
};

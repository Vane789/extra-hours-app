import "./ReportsPage.scss";
import { ReportInfo } from "../components/ReportInfo/ReportInfo";
import home from "../assets/images/home.png";
import { Typography } from "antd"; 

const { Title } = Typography; 

const Reports = () => {
  const pageTitle = "Informes";
  return (
    <>
      <header className="page__header">
      <a href="http://localhost:5173/menu">
          <img className="home" src={home} alt="home" />
          </a>
      </header>
      <Title level={2} className="title">{pageTitle}</Title>
      <ReportInfo />
    </>
  );
};

export default Reports;

import "./ReportsPage.scss";
import { ReportInfo } from "../components/ReportInfo/ReportInfo";
import home from "../assets/images/home.png";

const Reports = () => {
  return (
    <>
      <header className="page__header">
      <a href="http://localhost:5173/menu">
          <img className="home" src={home} alt="home" />
          </a>
      </header>
      <h2>Informes</h2>
      <ReportInfo />
    </>
  );
};

export default Reports;

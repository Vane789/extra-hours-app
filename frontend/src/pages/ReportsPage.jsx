import "./ReportsPage.scss";
import { ReportInfo } from "../components/ReportInfo/ReportInfo";
// import logo from "../../../server/public/images/logo.png";
// import logo2 from "../../../server/public/images/logo2.png";

const Reports = () => {
  return (
    <>
      <header className="page__header">
        <a href="http://localhost:5173/">
          {/* <img className="logo1" src={logo} />
          <img className="logo2" src={logo2} /> */}
          {/* <h1 class="heading">Horas Extra Amadeus</h1> */}
        </a>
      </header>
      <h2>Informes</h2>
      <ReportInfo />
    </>
  );
};

export default Reports;

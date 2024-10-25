import "./PayExtraHoursPage.scss";
import { PayExtraHours } from "../components/PayExtraHours/PayExtraHours";
// import logo from "../../../server/public/images/logo.png";
// import logo2 from "../../../server/public/images/logo2.png";

const PayExtraHoursPage = () => {
  return (
    <>
      <header className="page__header">
        <a href="http://localhost:5173/">
          {/* <img className="logo1" src={logo} />
          <img className="logo2" src={logo2} /> */}
          {/* <h1 class="heading">Horas Extra Amadeus</h1> */}
        </a>
      </header>

      <h2>Pagar horas extra</h2>
      <PayExtraHours />
    </>
  );
};

export default PayExtraHoursPage;

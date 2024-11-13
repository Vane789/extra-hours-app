import "./PayExtraHoursPage.scss";
import { PayExtraHours } from "../components/PayExtraHours/PayExtraHours";
import home from "../assets/images/home.png";

const PayExtraHoursPage = () => {
  return (
    <>
      <header className="page__header">
      <a href="http://localhost:5173/menu">
          <img className="home" src={home} alt="home" />
          </a>
      </header>

      <h2>Pagar horas extra</h2>
      <PayExtraHours />
    </>
  );
};

export default PayExtraHoursPage;

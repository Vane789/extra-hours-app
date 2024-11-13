import "./ApprovePage.scss";
import { Approve } from "../components/Approve/Approve";
import home from "../assets/images/home.png";

const ApproveExtrahour = () => {
  return (
    <>
      <header className="page__header">
      <a href="http://localhost:5173/menu">
          <img className="home" src={home} alt="home" />
          </a>
      </header>

      <h2>Aprobar - Eliminar horas extra</h2>
      <Approve />
    </>
  );
};

export default ApproveExtrahour;

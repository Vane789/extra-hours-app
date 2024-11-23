import "./ApprovePage.scss";
import { Approve } from "../components/Approve/Approve";
import home from "../assets/images/home.png";
import { Typography } from "antd"; 

const { Title } = Typography; 

const ApproveExtrahour = () => {
  const pageTitle = "Aprobar - Eliminar horas extra";
  return (
    <>
      <header className="page__header">
      <a href="http://localhost:5173/menu">
          <img className="home" src={home} alt="home" />
          </a>
      </header>
      <Title level={2} className="title">{pageTitle}</Title>
      <Approve />
    </>
  );
};

export default ApproveExtrahour;

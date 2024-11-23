import { UpdateAndDelete } from "../components/UpdateAndDelete/UpdateAndDelete";
import "./DeleteExtrahour.scss";
import home from "../assets/images/home.png";
import { Typography } from "antd"; 

const { Title } = Typography; 

const DeleteExtrahour = () => {
  const pageTitle = "Actualizar - Eliminar horas extra";
  return (
    <>
      <div>
        <header className="page__header">
        <a href="http://localhost:5173/menu">
          <img className="home" src={home} alt="home" />
          </a>
        </header>
        <Title level={2} className="title">{pageTitle}</Title>
        <UpdateAndDelete />
      </div>
    </>
  );
};

export default DeleteExtrahour;

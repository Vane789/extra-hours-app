import "./AddExtrahour.scss";
import { FormExtraHour } from "../components/FormExtraHour/FormExtraHour";
import home from "../assets/images/home.png";
import { Link } from "react-router-dom";
import { Typography } from "antd"; 

const { Title } = Typography; 

const AddExtrahour = () => {
  const pageTitle = "Agregar Horas Extras";

  return (
    <>
      <div>
        <header className="page__header">
          <Link to="/menu">
            <img className="home" src={home} alt="home" />
          </Link>
        </header>
        <Title level={2} className="title">{pageTitle}</Title>
        <FormExtraHour className="addhour" />
      </div>
    </>
  );
};

export default AddExtrahour;

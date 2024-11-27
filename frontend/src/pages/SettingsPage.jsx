import home from "../assets/images/home.png";
import { Typography } from "antd"; 
import { Setting } from "../components/Settings/Setting";

const { Title } = Typography; 

const SettingsPage = () => {
  const pageTitle = "Panel de Administración de Sistemas";
  return (
    <>
      <header className="page__header">
      <a href="http://localhost:5173/menu">
          <img className="home" src={home} alt="home" />
          </a>
      </header>
      <Title level={2} className="title">{pageTitle}</Title>
      <Setting />
    </>
  );
};

export default SettingsPage;

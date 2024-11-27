import { History } from "../components/HistoryPage/History";
import home from "../assets/images/home.png";
import { Typography } from "antd"; 

const { Title } = Typography; 

const HistoryPage = () => {
  const pageTitle = "Historial Horas Extras";
  return (
    <>
      <div>
        <header className="page__header">
        <a href="http://localhost:5173/menu">
          <img className="home" src={home} alt="home" />
          </a>
        </header>
        <Title level={2} className="title">{pageTitle}</Title>
        <History />
      </div>
    </>
  );
};

export default HistoryPage;

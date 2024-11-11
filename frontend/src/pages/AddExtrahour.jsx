import "./AddExtrahour.scss";
import { FormExtraHour } from "../components/FormExtraHour/FormExtraHour";
import home from "../assets/images/home.png";

const AddExtrahour = () => {
  return (
    <>
      <div>
        <header className="page__header">
       
          <a href="http://localhost:5173/menu">
          <img className="home" src={home} alt="home" />
          </a>
        </header>
        <h2>Agregar horas extra</h2>
        <FormExtraHour />
      </div>
    </>
  );
};

export default AddExtrahour;

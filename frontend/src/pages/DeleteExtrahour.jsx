import { UpdateAndDelete } from "../components/UpdateAndDelete/UpdateAndDelete";
import "./DeleteExtrahour.scss";
import home from "../assets/images/home.png";

const DeleteExtrahour = () => {
  return (
    <>
      <div>
        <header className="page__header">
        <a href="http://localhost:5173/menu">
          <img className="home" src={home} alt="home" />
          </a>
        </header>
        <h2>Actualizar - Eliminar horas extra</h2>
        <UpdateAndDelete />
      </div>
    </>
  );
};

export default DeleteExtrahour;

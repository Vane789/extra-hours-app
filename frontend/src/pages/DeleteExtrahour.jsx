import { UpdateAndDelete } from "../components/UpdateAndDelete/UpdateAndDelete";
import "./DeleteExtrahour.scss";
// import logo from "../../../server/public/images/logo.png";
// import logo2 from "../../../server/public/images/logo2.png";

const DeleteExtrahour = () => {
  return (
    <>
      <div>
        <header className="page__header">
          <a href="http://localhost:5173/">
            {/* <img className="logo1" src={logo} />
            <img className="logo2" src={logo2} /> */}
            {/* <h1 class="heading">Horas Extra Amadeus</h1> */}
          </a>
        </header>
        <h2>Actualizar - Eliminar horas extra</h2>
        <UpdateAndDelete />
      </div>
    </>
  );
};

export default DeleteExtrahour;

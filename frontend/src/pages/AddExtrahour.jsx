import "./AddExtrahour.scss";
import { FormExtraHour } from "../components/FormExtraHour/FormExtraHour";
// import logo from "../../../server/public/images/logo.png";
// import logo2 from "../../../server/public/images/logo2.png";

const AddExtrahour = () => {
  return (
    <>
      <div>
        <header className="page__header">
          <a href="http://localhost:5173/">
            {/* <img className="logo1" src={logo} />
            <img className="logo2" src={logo2} /> */}
            {/* <h1 className="heading">Horas Extra Amadeus</h1> */}
          </a>
        </header>
        <h2>Agregar horas extra</h2>
        <FormExtraHour />
      </div>
    </>
  );
};

export default AddExtrahour;

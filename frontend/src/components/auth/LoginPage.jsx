import { useState, useContext } from "react";
import { Form, Input, Button } from "antd";
import "./LoginPage.scss";
import amadeus from "../../assets/images/amadeus.png";
import { AuthContext } from '../context/AuthContext';
// import Footer from "../common/Footer";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  
  const handleSubmit = async (values) => {
    try {
      await login(values.email, values.password); 
    } catch (error) {
      setError("Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="left-side"></div>
      <div className="right-side">
        <img className="amadeus" src={amadeus} alt="amadeus" />
        
        {error && <p className="error-message">{error}</p>}
        <Form name="login-form" onFinish={handleSubmit} layout="vertical">
        <h4 className="inicio">Inicio de sesión</h4>
          <Form.Item
            label="Email: "
            name="email"
            rules={[{ required: true, message: "Por favor ingrese su email" }]}
          >
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[
              { required: true, message: "Por favor ingrese su contraseña" },
            ]}
          >
            <Input.Password
              placeholder="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button className="button" type="primary" htmlType="submit" block>
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>
      </div>
      </div>
  );
};

export default Login;

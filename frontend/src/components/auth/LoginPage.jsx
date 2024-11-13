import { useState, useContext } from "react";
import { Form, Input, Button } from "antd";
import "./LoginPage.scss";
import usuario from "../../assets/images/usuario.png";
import { AuthContext } from '../context/AuthContext';

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
      <img className="logousuario" src={usuario} alt="usuario" />
      {error && <p className="error-message">{error}</p>}
      <Form name="login-form" onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Email: "
          name="email"
          rules={[{ required: true, message: "Por favor ingrese su email" }]}
        >
          <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          name="password"
          rules={[
            { required: true, message: "Por favor ingrese su contraseña" },
          ]}
        >
          <Input.Password placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </Form.Item>

        <Form.Item>
          <Button
            className="button"
            type="primary"
            htmlType="submit"
            block
          >
            Iniciar Sesión
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;

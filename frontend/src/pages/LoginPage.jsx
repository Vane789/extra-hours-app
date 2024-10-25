import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { useAuth } from "../utils/AuthContext";
import "./LoginPage.scss";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { auth, login } = useAuth();

  //Simulación de ussuarios con roles
  const users = [
    { username: "empleado", password: "empleado123", role: "empleado" },
    { username: "manager", password: "manager123", role: "manager" },
    {
      username: "superusuario",
      password: "superusuario123",
      role: "superusuario",
    },
  ];

  useEffect(() => {
    if (auth) {
      switch (auth.role) {
        case "empleado":
          navigate("/empleado-dashboard");
          break;
        case "manager":
          navigate("/manager-dashboard");
          break;
        case "superusuario":
          navigate("/superusuario-dashboard");
          break;
        default:
          navigate("/");
          break;
      }
    }
  }, [auth, navigate]);

  const handleLogin = (values) => {
    setLoading(true);

    //Simulación de la autenticación
    const user = users.find(
      (user) =>
        user.username === values.username && user.password === values.password
    );

    if (user) {
      message.success(`Bienvenido ${user.username}`);

      login(user.role);
      navigate("/menu");
    } else {
      message.error("Usuario o contraseña incorrectos");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <Form name="login-form" onFinish={handleLogin} layout="vertical">
        <Form.Item
          label="Usuario"
          name="username"
          rules={[{ required: true, message: "Por favor ingrese su usuario" }]}
        >
          <Input placeholder="Usuario" />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          name="password"
          rules={[
            { required: true, message: "Por favor ingrese su contraseña" },
          ]}
        >
          <Input.Password placeholder="Contraseña" />
        </Form.Item>

        <Form.Item>
          <Button
            className="button"
            type="primary"
            htmlType="submit"
            loading={loading}
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

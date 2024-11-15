import { useContext } from 'react';
import { Layout, Card, Row, Col, Typography, Avatar, Space, Dropdown, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import {
  PlusCircleOutlined,
  DeleteOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined
} from '@ant-design/icons';
import './ExtraHoursMenu.scss';
import amadeus from "../assets/images/amadeusLogo.png";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const ExtraHoursMenu = () => {
  const navigate = useNavigate();
  const { auth, logout } = useContext(AuthContext);

  const MENU_ITEMS = {
    USER: [
      {
        icon: <PlusCircleOutlined />,
        title: "Registrar Horas Extras",
        description: "Agregar nuevos registros de horas extras",
        path: "/add",
      },
      {
        icon: <BarChartOutlined />,
        title: "Mis Registros",
        description: "Ver mi historial de horas extras",
        path: "/my-records",
      }
    ],
    ADMIN: [
      {
        icon: <PlusCircleOutlined />,
        title: "Registrar Horas",
        description: "Agregar nuevos registros de horas extras",
        path: "/add",
      },
      {
        icon: <DeleteOutlined />,
        title: "Gestionar Registros",
        description: "Actualizar o eliminar registros existentes",
        path: "/delete",
      },
      {
        icon: <BarChartOutlined />,
        title: "Informes",
        description: "Generación de reportes y análisis",
        path: "/reports",
      },
      {
        icon: <CheckCircleOutlined />,
        title: "Aprobaciones",
        description: "Gestionar aprobaciones de nómina",
        path: "/approve-payroll",
      },
      {
        icon: <DollarOutlined />,
        title: "Pagos",
        description: "Gestionar pagos de horas extras",
        path: "/update",
      },
      {
        icon: <SettingOutlined />,
        title: "Configuración",
        description: "Ajustes del sistema",
        path: "/settings",
      },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    logout();
    navigate('/login');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Mi Perfil
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Cerrar Sesión
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="extra-hours-layout">
      <Header className="extra-hours-header">
        <div className="extra-hours-header-logo">
          <img className="amadeus" src={amadeus} alt="amadeus" />
          <h3>Sistema de Gestión de Horas Extras</h3>
        </div>
        <Dropdown overlay={userMenu} placement="bottomRight" trigger={['click']}>
          <div className="extra-hours-header-user">
            <Space>
              <Avatar icon={<UserOutlined />} />
              <Text>{auth?.email}</Text>
            </Space>
          </div>
        </Dropdown>
      </Header>

      <Content className="extra-hours-content">
        <Row gutter={[24, 24]}>
          {MENU_ITEMS[auth?.role]?.map((item, index) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={index}>
              <Card 
                className="extra-hours-card" 
                onClick={() => navigate(item.path)}
                hoverable
              >
                <div className="extra-hours-card-icon">
                  {item.icon}
                </div>
                <Title level={4} className="extra-hours-card-title">
                  {item.title}
                </Title>
                <Text className="extra-hours-card-description">
                  {item.description}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default ExtraHoursMenu;
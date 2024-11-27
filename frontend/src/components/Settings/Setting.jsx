import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  message,
  Statistic,
  Typography,
  Space
} from 'antd';
import { 
    PlusOutlined, 
    ClockCircleOutlined, 
    AlertOutlined, 
    UserAddOutlined 
  } from '@ant-design/icons';
import "./Setting.scss";
import { addHourType } from "@service/settings";
import { createIncident } from "@service/settings";
import { registerUser } from "@service/settings";

const { Text, Paragraph } = Typography;

const Role = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  USER: 'USER'
};

const SettingsCard = ({ 
    title, 
    description, 
    icon, 
    buttonText, 
    onAddClick,
    stats = []
  }) => {
    return (
      <div className="settings-card">
        <div className="settings-card__icon-container">
          {React.cloneElement(icon, { 
            className: "card-icon" 
          })}
        </div>
        <div className="settings-card__content">
          <div className="settings-card__content-title">{title}</div>
          <Paragraph 
            className="settings-card__content-description" 
            ellipsis={{ rows: 3 }}
          >
            {description}
          </Paragraph>
          <div className="settings-card__content-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat">
                <div className="stat-title">{stat.title}</div>
                <div 
                  className="stat-value" 
                  style={{ color: stat.color || '#3f8600' }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={onAddClick}
          className="settings-card__action-button"
        >
          {buttonText}
        </Button>
      </div>
    );
  };
  

export const Setting = () => {
  const [overtimeTypeModal, setOvertimeTypeModal] = useState(false);
  const [incidentModal, setIncidentModal] = useState(false);
  const [userRegistrationModal, setUserRegistrationModal] = useState(false);

  const cardConfigurations = [
    {
      title: "Tipos de Horas Extras",
      description: "Gestiona y configura los diferentes tipos de horas extras en tu organización. Puedes definir porcentajes de recargo, descripciones detalladas y categorizar las diferentes modalidades de trabajo adicional.",
      icon: <ClockCircleOutlined />,
      buttonText: "Añadir Tipo de Hora Extra",
      onAddClick: () => setOvertimeTypeModal(true),
    },
    {
      title: "Incidentes",
      description: "Registra y da seguimiento a los incidentes laborales. Documenta detalles importantes, fechas de ocurrencia y mantén un registro histórico para análisis y mejora continua de procesos.",
      icon: <AlertOutlined />,
      buttonText: "Registrar Incidente",
      onAddClick: () => setIncidentModal(true),
    },
    {
      title: "Registro de Usuarios",
      description: "Administra el acceso de usuarios al sistema. Crea nuevas cuentas, asigna roles (Admin, Manager, User) y gestiona la información de tu equipo de trabajo de manera centralizada y segura.",
      icon: <UserAddOutlined />,
      buttonText: "Añadir Usuario",
      onAddClick: () => setUserRegistrationModal(true),
    }
  ];

  const [overtimeTypeForm] = Form.useForm();
  const handleOvertimeTypeSubmit = async (values) => {
    try {
      const response = await addHourType(values); 
      console.log('Respuesta API - Tipo de Hora Extra:', response);
      message.success('Tipo de hora extra añadido exitosamente');
      setOvertimeTypeModal(false); 
      overtimeTypeForm.resetFields(); 
    } catch (error) {
      console.error('Error al añadir tipo de hora extra:', error);
      message.error('No se pudo añadir el tipo de hora extra');
    }
  };
  
  const [incidentForm] = Form.useForm();
  const handleIncidentSubmit = async (values) => {
    const formData = {
      ...values,
      createdAt: new Date().toISOString(), 
    };
  
    try {
      const response = await createIncident(formData); 
      console.log('Respuesta API - Incidente:', response);
      message.success('Incidente registrado exitosamente');
      setIncidentModal(false); 
      incidentForm.resetFields(); 
    } catch (error) {
      console.error('Error al registrar incidente:', error);
      message.error('No se pudo registrar el incidente');
    }
  };
  
  const [userForm] = Form.useForm();
  const handleUserRegistration = async (values) => {
    try {
      const response = await registerUser(values); 
      console.log('Respuesta API - Registro de Usuario:', response);
      message.success('Usuario registrado exitosamente');
      setUserRegistrationModal(false); 
      userForm.resetFields(); 
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      message.error('No se pudo registrar el usuario');
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-grid">
        {cardConfigurations.map((config, index) => (
          <SettingsCard key={index} {...config} />
        ))}
      </div>

      <Modal
        className="settings-modal"
        title="Añadir Tipo de Hora Extra"
        open={overtimeTypeModal}
        onCancel={() => setOvertimeTypeModal(false)}
        footer={null}
      >
        <Form
          form={overtimeTypeForm}
          layout="vertical"
          onFinish={handleOvertimeTypeSubmit}
        >
          <Form.Item
            name="description"
            label="Descripción"
            rules={[{ required: true, message: 'Por favor ingrese una descripción' }]}
          >
            <Input placeholder="Descripción del tipo de hora extra" />
          </Form.Item>
          
          <Form.Item
            name="percentage"
            label="Porcentaje"
            rules={[{ required: true, message: 'Por favor ingrese el porcentaje' }]}
          >
            <InputNumber 
              min={0} 
              max={200} 
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              style={{ width: '100%' }}
              placeholder="Porcentaje de recargo"
            />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        className="settings-modal"
        title="Registrar Incidente"
        open={incidentModal}
        onCancel={() => setIncidentModal(false)}
        footer={null}
      >
        <Form
          form={incidentForm}
          layout="vertical"
          onFinish={handleIncidentSubmit}
        >
          <Form.Item
            name="description"
            label="Descripción del Incidente"
            rules={[{ required: true, message: 'Por favor ingrese una descripción' }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Detalles del incidente" 
            />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Registrar Incidente
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        className="settings-modal"
        title="Registrar Usuario"
        open={userRegistrationModal}
        onCancel={() => setUserRegistrationModal(false)}
        footer={null}
      >
        <Form
          form={userForm}
          layout="vertical"
          onFinish={handleUserRegistration}
        >
          <Form.Item
            name="identification"
            label="Identificación"
            rules={[{ required: true, message: 'Por favor ingrese la identificación' }]}
          >
            <Input placeholder="Número de identificación" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Correo Electrónico"
            rules={[
              { required: true, message: 'Por favor ingrese el correo electrónico' },
              { type: 'email', message: 'Por favor ingrese un correo electrónico válido' }
            ]}
          >
            <Input placeholder="Correo electrónico" />
          </Form.Item>
          
          <Form.Item
            name="city"
            label="Ciudad"
            rules={[{ required: true, message: 'Por favor ingrese la ciudad' }]}
          >
            <Input placeholder="Ciudad" />
          </Form.Item>
          
          <Form.Item
            name="role"
            label="Rol"
            rules={[{ required: true, message: 'Por favor seleccione un rol' }]}
          >
            <Select placeholder="Seleccione un rol">
              {Object.values(Role).map(role => (
                <Select.Option key={role} value={role}>
                  {role}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="position"
            label="Cargo"
            rules={[{ required: true, message: 'Por favor ingrese el cargo' }]}
          >
            <Input placeholder="Cargo del usuario" />
          </Form.Item>
          
          <Form.Item
            name="name"
            label="Nombre Completo"
            rules={[{ required: true, message: 'Por favor ingrese el nombre completo' }]}
          >
            <Input placeholder="Nombre completo" />
          </Form.Item>
          
          <Form.Item
            name="salary"
            label="Salario"
            rules={[{ required: true, message: 'Por favor ingrese el salario' }]}
          >
            <InputNumber 
              min={0} 
              style={{ width: '100%' }} 
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Salario del usuario" 
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="Contraseña"
            rules={[
              { required: true, message: 'Por favor ingrese una contraseña' },
              { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
            ]}
          >
            <Input.Password placeholder="Contraseña" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Registrar Usuario
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import UserService from "../components/service/UserService";
import "./ProfilePage.scss";
import { Typography } from "antd"; 
import { toast } from 'react-toastify';

const { Title } = Typography; 

const ProfilePage = () => {
  const pageTitle = "Mi Perfil";
  const { auth } = useContext(AuthContext); 
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: auth?.email || "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;
    const identification = auth?.identification; 

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token'); 
      const updatedPassword = { password };

      await UserService.updatePassword(identification, updatedPassword, token);
      
      toast.success("Contraseña actualizada con éxito.");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error al actualizar la contraseña.");
    }
  };
 
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profileData = await UserService.getYourProfile(token);
          setFormData((prevData) => ({
            ...prevData,
            email: profileData.email,
          }));
        } catch (error) {
          toast.error("No se pudo cargar el perfil");
        }
      }
    };
    fetchProfile();
  }, [auth.id]);

  return (
    <div className="profile-page">
      <Title level={2} className="title">{pageTitle}</Title>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Nueva contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar contraseña:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Actualizando..." : "Actualizar"}
        </button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default ProfilePage;

import { createContext, useState, useEffect } from 'react';
import UserService from '../service/UserService';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role'),
        email: localStorage.getItem('email'),
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const email = localStorage.getItem('email');
        
        if (token) {
            setAuth({ token, role, email });
        } else {
            setAuth({ token: null, role: null, email: null });
        }
    }, []);

    const isAuthenticated = () => {
        return !!auth.token;
    };

    const login = async (email, password) => {
        try {
            console.log("Intentando login con:", email);
            const userData = await UserService.login(email, password);
            console.log("Respuesta del servidor:", userData);

            if (userData.token) {
                localStorage.setItem('token', userData.token);
                localStorage.setItem('role', userData.role);
                localStorage.setItem('email', email);

                setAuth({ 
                    token: userData.token, 
                    role: userData.role, 
                    email: email 
                });

                console.log("Login exitoso, rol:", userData.role);

                switch(userData.role) {
                    case 'ADMIN':
                        console.log("Redirigiendo a /menu como ADMIN");
                        navigate('/menu', { replace: true });
                        break;
                    case 'USER':
                        console.log("Redirigiendo a /menu como USER");
                        navigate('/menu', { replace: true });
                        break;
                    default:
                        console.log("Rol no reconocido:", userData.role);
                        navigate('/login');
                }
            }
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    };

    const logout = () => {
        console.log("Ejecutando logout");
        localStorage.removeItem("authToken"); 
        
        setAuth({ 
            token: null, 
            role: null, 
            email: null 
        });
        
        UserService.logout();
        navigate('/login', { replace: true });
    };

    const isAdmin = () => auth.role === 'ADMIN';
    const isUser = () => auth.role === 'USER';

    return (
        <AuthContext.Provider value={{ 
            auth, 
            login, 
            logout, 
            isAuthenticated, 
            isAdmin, 
            isUser 
        }}>
            {children}
        </AuthContext.Provider>
    );
};
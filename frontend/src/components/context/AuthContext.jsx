import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';

export const AuthContext = createContext();

export const ProtectedRoute = ({ children, roles = [] }) => {
  const { auth, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(auth.role)) {
    return <Navigate to="/menu" replace />;
  }

  return children;
};

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role'),
        email: localStorage.getItem('email'),
        identification: localStorage.getItem('identification'),
        salary: localStorage.getItem('salary'),
        name: localStorage.getItem('name')
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const email = localStorage.getItem('email');
        const name = localStorage.getItem('name');
        const identification = localStorage.getItem('identification');
        const salary = localStorage.getItem('salary');
        
        if (token) {
            setAuth({ token, role, email, name, identification, salary });
        } else {
            setAuth({ 
                token: null, 
                role: null, 
                email: null, 
                name: null, 
                identification: null, 
                salary: null 
            });
        }
    }, []);

    const isAuthenticated = () => {
        return !!auth.token;
    };

    const login = async (email, password) => {
        try {
            const userData = await UserService.login(email, password);

            if (userData.token) {
                const profile = await UserService.getYourProfile(userData.token);
                
                const authData = {
                    token: userData.token,
                    role: userData.role,
                    email: email,
                    name: profile.name,
                    identification: profile.identification,
                    salary: profile.salary
                };

                // Guardar en localStorage
                Object.entries(authData).forEach(([key, value]) => 
                    localStorage.setItem(key, value)
                );

                setAuth(authData);

                // Redirigir según el rol
                navigate('/menu', { replace: true });
            }
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    };

    const logout = () => {
        // Limpiar localStorage
        ['token', 'role', 'email', 'name', 'identification', 'salary']
            .forEach(key => localStorage.removeItem(key));
        
        setAuth({ 
            token: null, 
            role: null, 
            email: null,
            name: null,
            identification: null,
            salary: null
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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
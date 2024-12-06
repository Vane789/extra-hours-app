import axios from "axios";

class UserService {
    static BASE_URL = "https://extra-hours-app.onrender.com/api/v1";

    static api = axios.create({
        baseURL: this.BASE_URL,
        withCredentials: true,  // Important for CORS with credentials
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // If you need to handle preflight requests explicitly
            'Access-Control-Allow-Origin': 'https://extra-hours-app.vercel.app',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': '*'
        }
    });

    static getAuthHeaders(token) {
        return { Authorization: `Bearer ${token}` };
    }

    // Métodos de autenticación
    static async login(email, password) {
        try {
            const response = await this.api.post("/auth/login", { email, password }, {
                // Additional config for specific request if needed
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Login Error:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw error.response?.data || error.message;
        }
    }

    static async register(userData, token) {
        try {
            const response = await this.api.post("/auth/register", userData, {
                headers: this.getAuthHeaders(token),
            });
            return response.data;
        } catch (error) {
            console.error("Error al registrar usuario:", error.response?.data || error.message);
            throw error.response?.data || error.message;
        }
    }

    // Métodos de usuario
    static async getAllUsers(token) {
        try {
            const response = await this.api.get("/admin/get-all-users", {
                headers: this.getAuthHeaders(token),
            });
            return response.data;
        } catch (error) {
            console.error("Error al obtener todos los usuarios:", error.response?.data || error.message);
            throw error.response?.data || error.message;
        }
    }

    static async getYourProfile(token) {
        try {
            const response = await this.api.get("/adminuser/profile", {
                headers: this.getAuthHeaders(token),
            });
            return response.data?.ourUsers || null; // Devuelve `null` si no hay datos
        } catch (error) {
            console.error("Error al obtener el perfil del usuario:", error.response?.data || error.message);
            throw error.response?.data || error.message;
        }
    }

    static async getUserById(identification, token) {
        try {
            const response = await this.api.get(`/admin/get-user/${identification}`, {
                headers: this.getAuthHeaders(token),
            });
            return response.data;
        } catch (error) {
            console.error(`Error al obtener usuario con identificación ${identification}:`, error.response?.data || error.message);
            throw error.response?.data || error.message;
        }
    }

    static async deleteUser(identification, token) {
        try {
            const response = await this.api.delete(`/admin/delete-user/${identification}`, {
                headers: this.getAuthHeaders(token),
            });
            return response.data;
        } catch (error) {
            console.error(`Error al eliminar usuario con identificación ${identification}:`, error.response?.data || error.message);
            throw error.response?.data || error.message;
        }
    }

    static async updatePassword(identification, passwordData, token) {
        try {
            const response = await this.api.put(`/users/password/${identification}`, passwordData, {
                headers: this.getAuthHeaders(token),
            });
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar la contraseña del usuario ${identification}:`, error.response?.data || error.message);
            throw error.response?.data || error.message;
        }
    }

    // Métodos de control de autenticación
    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        localStorage.removeItem('identification');
        localStorage.removeItem('salary');
    }

    static isAuthenticated() {
        return Boolean(localStorage.getItem('token'));
    }

    static isAdmin() {
        return localStorage.getItem('role') === 'ADMIN';
    }

    static isUser() {
        return localStorage.getItem('role') === 'USER';
    }
}

export default UserService;

import axios from "axios";

class UserService {
    static BASE_URL = "https://extra-hours-app.onrender.com/api/v1";

    static api = axios.create({
        baseURL: this.BASE_URL,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'https://extra-hours-app.vercel.app'
        }
    });

    static getAuthHeaders(token) {
        return { Authorization: `Bearer ${token}` };
    }

    // Métodos de autenticación
    static async login(email, password) {
        try {
            const response = await UserService.api.post("/auth/login", { email, password });
            return response.data;
        } catch (error) {
            console.error("Error en login:", error.response?.data || error.message);
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

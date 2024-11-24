import axios from "axios";

class UserService {
    static BASE_URL = "http://localhost:8080/api/v1";

    static getAuthHeaders(token) {
        return { Authorization: `Bearer ${token}` };
    }

    // Métodos de autenticación
    static async login(email, password) {
        return axios.post(`${this.BASE_URL}/auth/login`, { email, password })
            .then(response => response.data);
    }

    static async register(userData, token) {
        return axios.post(`${this.BASE_URL}/auth/register`, userData, {
            headers: this.getAuthHeaders(token),
        }).then(response => response.data);
    }

    // Métodos de usuario
    static async getAllUsers(token) {
        return axios.get(`${this.BASE_URL}/admin/get-all-users`, {
            headers: this.getAuthHeaders(token),
        }).then(response => response.data);
    }

    static async getYourProfile(token) {
        return axios.get(`${this.BASE_URL}/adminuser/profile`, {
            headers: this.getAuthHeaders(token),
        }).then(response => response.data.ourUsers); 
    }

    static async getUserById(userId, token) {
        return axios.get(`${this.BASE_URL}/admin/get-user/${userId}`, {
            headers: this.getAuthHeaders(token),
        }).then(response => response.data);
    }

    static async deleteUser(userId, token) {
        return axios.delete(`${this.BASE_URL}/admin/delete-user/${userId}`, {
            headers: this.getAuthHeaders(token),
        }).then(response => response.data);
    }

    static async updateUser(userId, userData, token) {
        return axios.put(`${this.BASE_URL}/admin/update-user/${userId}`, userData, {
            headers: this.getAuthHeaders(token),
        }).then(response => response.data);
    }

    // Métodos de control de autenticación
    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
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

    static adminOnly() {
        return this.isAuthenticated() && this.isAdmin();
    }
}

export default UserService;

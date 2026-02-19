import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authService = {
    login: async (email, password, role) => {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password,
            role,
        });
        const { token, user } = response.data.data;
        return { token, user };
    },

    register: async (userData) => {
        const response = await axios.post(`${API_URL}/auth/register`, {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: userData.role,
        });
        return response.data.data;
    },

    getProfile: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data;
    },

    getAllUsers: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/auth/users`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data;
    },
};

export default authService;

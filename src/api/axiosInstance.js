import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000/api', // Apne backend ka base URL confirm kar lena
});

// Request Interceptor: Token automatically headers mein bhejega
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;
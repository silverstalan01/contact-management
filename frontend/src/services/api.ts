import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api'  // Make sure this matches your backend port
});

export default api;

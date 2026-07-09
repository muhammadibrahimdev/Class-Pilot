import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api'
});
let apiCount = 0;
API.interceptors.request.use((config) => {
    apiCount++;
    console.log("API Hits:", apiCount);
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.authorization = `Bearer ${token}`
    };
    return config;
});

export default API
import axios from 'axios';

axios.defaults.withCredentials = true;
const config = {
    baseURL: import.meta.env.VITE_API_BASE_URL,
    // baseURL: 'http://192.168.1.13:5002/api'
    //baseURL:"https://tvsapi.gandhitvs.in/api"
};

export default config;


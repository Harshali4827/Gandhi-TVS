import axios from 'axios';

axios.defaults.withCredentials = true;
const config = {
                baseURL: import.meta.env.VITE_API_BASE_URL,
        //       baseURL: 'http://192.168.1.2:5000/api'
};

export default config;


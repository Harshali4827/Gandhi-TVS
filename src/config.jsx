import axios from 'axios';

axios.defaults.withCredentials = true;
const config = {
//   baseURL: import.meta.env.REACT_APP_API_BASE_URL,
    baseURL: 'http://192.168.1.11:5001/api'
    // baseURL:"https://tvsapi.gandhitvs.in/api"
};

export default config;


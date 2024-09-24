import axios from 'axios';

const app = axios.create({
    baseURL: 'https://eropics.to/',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export default app;

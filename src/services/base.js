import axios from 'axios';

export const maxios = axios.create({
    baseURL: '//localhost:8000/',
    headers: {
    }
})
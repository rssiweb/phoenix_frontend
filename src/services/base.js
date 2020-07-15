import axios from 'axios';

const token = localStorage.getItem('token') || ''


export const maxios = axios.create({
    baseURL: '//localhost:8000/',
    headers: {
        'Authorization': `Token ${token}`
    }
})
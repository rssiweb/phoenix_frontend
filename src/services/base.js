import axios from 'axios';

const token = localStorage.getItem('token') || ''
var headers = {}
if (token) {
    headers['Authorization'] = `Token ${token}`
}

export const maxios = axios.create({
    baseURL: '//localhost:8000/',
    headers: headers
})
import axios from 'axios';

const token = localStorage.getItem('token') || ''
var headers = {}
if (token) {
    headers['Authorization'] = `Token ${token}`
}

export const maxios = axios.create({
    baseURL: '//192.168.1.139:8000/',
    headers: headers
})
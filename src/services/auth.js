import { maxios } from './base.js'


export class TokenService {

    get_token(email, password) {
        return maxios.post('/api/auth/', { username: email, password: password })
            .then(response => {
                return response
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
}

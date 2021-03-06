import { maxios } from './base.js'


class TokenService {
    get_token(email, password) {
        return maxios.post('/api/auth/', { username: email, password: password })
            .then(response => {
                return Promise.resolve(response)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
}

export default new TokenService()
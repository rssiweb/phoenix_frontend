import { maxios } from './base.js'


class SessionService {
    all() {
        return maxios.get(`/api/session/`)
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
}

export default new SessionService()
import { backend } from '.'


class SessionService {
    all() {
        return backend.get(`/api/session/`)
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
}

export default new SessionService()
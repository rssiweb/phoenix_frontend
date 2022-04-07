import { backend } from '.'


class UserService {
    get_profile(id) {
        return backend.get(`/api/faculty/${id}`)
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
}

export default new UserService()
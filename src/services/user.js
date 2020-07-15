import { maxios } from './base.js'


class UserService {
    get_profile(id) {
        return maxios.get(`/api/faculty/${id}`)
            .then(response => {
                return Promise.resolve(response)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
}

export default new UserService()
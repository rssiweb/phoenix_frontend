import { maxios } from './base.js'


class StudentService {
    all() {
        return maxios.get(`/api/student/`)
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
}

export default new StudentService()
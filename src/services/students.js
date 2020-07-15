import { maxios } from './base.js'


class StudentsService {
    get_students() {
        return maxios.get(`/api/students/`)
            .then(response => {
                return Promise.resolve(response)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
}

export default new StudentsService()
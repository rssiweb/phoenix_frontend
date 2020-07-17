import { maxios } from './base.js'


class StudentService {
    of_class(classroom) {
        return maxios.get('/api/students-of-class/', { "classroom": classroom })
            .then(response => {
                console.log(response, "asdad")
            })
            .catch(error => {
                console.log(error, "asdad")
            })
    }
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
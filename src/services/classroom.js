import { maxios } from './base.js'


class ClassroomService {
    all(params) {
        return maxios.get('/api/classroom', { params: params })
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
}

export default new ClassroomService()
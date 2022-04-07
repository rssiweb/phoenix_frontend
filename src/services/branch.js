import { backend } from './base.js'


class BranchService {
    all() {
        return backend.get('/api/branch')
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
    one(branch_id) {
        return backend.get(`/api/branch/${branch_id}`)
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
}

export default new BranchService()
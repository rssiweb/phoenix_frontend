import { backend } from '.'


class ClassroomService {
    all(params) {
        return backend.get('/api/classroom', { params: params })
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
    students(params) {
        return backend.get('/api/classroom-students/', { params: params })
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
    attendance(params) {
        return backend.get('/api/classroom/', { params: params })
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
    start_class(data) {
        return backend.post('/api/class-attendance/', data)
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
    end_class(classroom_id, data) {
        return backend.patch(`/api/class-attendance/${classroom_id}/`, data)
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
    get_attendance(params) {
        return backend.get('/api/class-attendance/', { params: params })
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
    add_student_attendance(data) {
        return backend.post('/api/student-attendance/', data)
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
    update_student_attendance(attendance_id, data) {
        return backend.put(`/api/student-attendance/${attendance_id}/`, data)
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
    delete_student_attendance(std_attendance_id) {
        return backend.delete(`/api/student-attendance/${std_attendance_id}/`)
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
    get_student_attendance(params) {
        return backend.get('/api/student-attendance/', { params: params })
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
}

export default new ClassroomService()
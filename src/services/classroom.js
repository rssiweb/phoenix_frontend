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
    students(params) {
        return maxios.get('/api/classroom-students/', { params: params })
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
    attendance(params) {
        return maxios.get('/api/classroom/', { params: params })
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
    start_class(data) {
        return maxios.post('/api/class-attendance/', data)
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
    end_class(classroom_id, data) {
        return maxios.patch(`/api/class-attendance/${classroom_id}/`, data)
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
    get_attendance(params) {
        return maxios.get('/api/class-attendance/', { params: params })
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
    set_student_attendance(data) {
        return maxios.post('/api/student-attendance/', data)
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
    delete_student_attendance(std_attendance_id) {
        return maxios.delete(`/api/student-attendance/${std_attendance_id}/`)
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
    get_student_attendance(params) {
        return maxios.get('/api/student-attendance/', { params: params })
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error);
            })
    }
}

export default new ClassroomService()
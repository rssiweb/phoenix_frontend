import axios from 'axios';
import store from "@/store"
import { AUTH_LOGOUT } from "@/store/actions";

const token = localStorage.getItem('token') || ''
var headers = {}
if (token) {
    headers['Authorization'] = `Token ${token}`
}

export const backend = axios.create({
    baseURL: process.env.VUE_APP_BASE_API_ENDPOINT,
    headers: headers
})

console.log("verbose mode", process.env.VUE_APP_VERBOSE);

class BaseService {
    verbose = process.env.VUE_APP_VERBOSE === "True"
    url = undefined
    version = ""
    constructor(url, params) {
        this.url = this.version + url;
        this.params = params || {}
    }
    _handle_token_error(error) {
        if(this.verbose) console.log(error)
        if (error && error.response && error.response.status == 401 && error.response.data.detail == "Invalid token.") {
            // clear authorization and reload
            store.dispatch(AUTH_LOGOUT);
            if (this.verbose) console.log("Logged out")
            window.location.reload()
        }
    }
    get(params, url_suffix) {
        var all_params = {...params, ...this.params }
        url_suffix = url_suffix ? `${url_suffix}/` : ''
        return backend.get(this.url + url_suffix, { params: all_params }).then(response => {
            if(this.verbose) console.log(response)
            return Promise.resolve(response.data)
        }).catch(error => {
            this._handle_token_error(error)
            return Promise.reject(error)
        })
    }
    post(payload, url_suffix) {
        url_suffix = url_suffix ? `${url_suffix}/` : ''
        return backend.post(this.url + url_suffix, payload).then(response => {
            if(this.verbose) console.log(response)
            return Promise.resolve(response.data)
        }).catch(error => {
            this._handle_token_error(error)
            return Promise.reject(error)
        })
    }
    put(payload, url_suffix) {
        url_suffix = url_suffix ? `${url_suffix}/` : ''
        return backend.put(this.url + url_suffix, payload).then(response => {
            if(this.verbose) console.log(response)
            return Promise.resolve(response.data)
        }).catch(error => {
            this._handle_token_error(error)
            return Promise.reject(error)
        })
    }
    patch(payload, url_suffix) {
        url_suffix = url_suffix ? `${url_suffix}/` : ''
        return backend.patch(this.url + url_suffix, payload).then(response => {
            if(this.verbose) console.log(response)
            return Promise.resolve(response.data)
        }).catch(error => {
            this._handle_token_error(error)
            return Promise.reject(error)
        })
    }
    delete(payload, url_suffix) {
        url_suffix = url_suffix ? `${url_suffix}/` : ''
        return backend.delete(this.url + url_suffix, { data: payload }).then(response => {
            if(this.verbose) console.log(response)
            return Promise.resolve(response.data)
        }).catch(error => {
            this._handle_token_error(error)
            return Promise.reject(error)
        })
    }
}

// App backend
export const token_service = new BaseService("/auth/")
export const branch_service = new BaseService("/branch")
export const faculty_service = new BaseService("/user/")
export const session_service = new BaseService("/session/")
export const classroom_service = new BaseService("/class/")

// export const token_service = new BaseService("/api/auth/")
// export const token_service = new BaseService("/api/auth/")


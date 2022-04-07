import {
    USER_REQUEST,
    REQUEST_,
    SUCCESS_,
    ERROR_,
    LOGOUT_
} from "@/store/actions";
import { backend, token_service } from '@/services'
const state = {
    token: localStorage.getItem("token") || "",
    status: "",
    hasLoadedOnce: false
};

const getters = {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status
};

const actions = {
    [REQUEST_]: ({ commit, dispatch }, data) => {
        return new Promise((resolve, reject) => {
            commit(REQUEST_);
            token_service.post({username: data.email, password: data.password})
                .then(resp => {
                    localStorage.setItem("token", resp.token);
                    backend.defaults.headers.common['Authorization'] = `Token ${resp.token}`
                    commit(SUCCESS_, resp.token);
                    dispatch(USER_REQUEST, resp.user_id);
                    resolve(resp);
                })
                .catch(err => {
                    commit(ERROR_, err);
                    localStorage.removeItem("token");
                    reject(err);
                });
        });
    },
    [LOGOUT_]: ({ commit }) => {
        return new Promise(resolve => {
            commit(LOGOUT_);
            delete backend.defaults.headers.common['Authorization']
            localStorage.removeItem("token");
            resolve();
        });
    }
};

const mutations = {
    [REQUEST_]: state => {
        state.status = "loading";
    },
    [SUCCESS_]: (state, token) => {
        state.status = "success";
        state.token = token;
        state.hasLoadedOnce = true;
    },
    [ERROR_]: state => {
        state.status = "error";
        state.hasLoadedOnce = true;
    },
    [LOGOUT_]: state => {
        state.token = "";
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
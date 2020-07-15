import {
    AUTH_REQUEST,
    AUTH_ERROR,
    AUTH_SUCCESS,
    AUTH_LOGOUT
} from "../actions/auth";
import { USER_REQUEST } from "../actions/user";
import token_service from "../../services/auth";
import { maxios } from '../../services/base'
const state = {
    token: localStorage.getItem("user-token") || "",
    status: "",
    hasLoadedOnce: false
};

const getters = {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status
};

const actions = {
    [AUTH_REQUEST]: ({ commit, dispatch }, data) => {
        return new Promise((resolve, reject) => {
            commit(AUTH_REQUEST);
            token_service.get_token(data.email, data.password)
                .then(resp => {
                    console.log(resp.data, "here", resp.data.token)
                    localStorage.setItem("token", resp.data.token);
                    // Here set the header of your ajax library to the token value.
                    // example with axios
                    maxios.defaults.headers.common['Authorization'] = `Token ${resp.data.token}`
                    commit(AUTH_SUCCESS, resp.data.token);
                    dispatch(USER_REQUEST, resp.data.user_id);
                    resolve(resp);
                })
                .catch(err => {
                    commit(AUTH_ERROR, err);
                    localStorage.removeItem("token");
                    reject(err);
                });
        });
    },
    [AUTH_LOGOUT]: ({ commit }) => {
        return new Promise(resolve => {
            commit(AUTH_LOGOUT);
            delete maxios.defaults.headers.common['Authorization']
            localStorage.removeItem("token");
            resolve();
        });
    }
};

const mutations = {
    [AUTH_REQUEST]: state => {
        state.status = "loading";
    },
    [AUTH_SUCCESS]: (state, token) => {
        state.status = "success";
        state.token = token;
        state.hasLoadedOnce = true;
    },
    [AUTH_ERROR]: state => {
        state.status = "error";
        state.hasLoadedOnce = true;
    },
    [AUTH_LOGOUT]: state => {
        state.token = "";
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
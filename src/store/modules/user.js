import { AUTH_LOGOUT, REQUEST_, SUCCESS_, ERROR_ } from "@/store/actions";
import {faculty_service} from "@/services";
import Vue from "vue";

const state = { success: null, loading: false, user: JSON.parse(localStorage.getItem("user") || "{}") };

const getters = {
    getUser: state => state.user,
    isUserLoaded: state => state.success
};

const actions = {
    [REQUEST_]: ({ commit }, username) => {
        commit(REQUEST_);
        faculty_service.get({}, username)
            .then(resp => {
                commit(SUCCESS_, resp);
            })
            .catch(() => {
                commit(ERROR_);
            });
    }
};

const mutations = {
    [REQUEST_]: state => {
        state.loading = true;
    },
    [SUCCESS_]: (state, user) => {
        localStorage.setItem("user", JSON.stringify(user));
        Vue.set(state, "user", user);
        state.success = true;
        state.loading = false;
    },
    [ERROR_]: state => {
        state.success= false;
        state.loading= false;
    },
    [AUTH_LOGOUT]: state => {
        state.user = {};
        localStorage.removeItem("user");
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
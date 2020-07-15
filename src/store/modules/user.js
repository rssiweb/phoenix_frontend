import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from "../actions/user";
import user_service from "../../services/user";
import Vue from "vue";
import { AUTH_LOGOUT } from "../actions/auth";

const state = { status: "", profile: JSON.parse(localStorage.getItem("profile")) || {}, };

const getters = {
    getProfile: state => state.profile,
    isProfileLoaded: state => !!state.profile.name
};

const actions = {
    [USER_REQUEST]: ({ commit, dispatch }, id) => {
        commit(USER_REQUEST);
        user_service.get_profile(id)
            .then(resp => {
                commit(USER_SUCCESS, resp.data);
            })
            .catch(() => {
                commit(USER_ERROR);
                // if resp is unauthorized, logout, to
                dispatch(AUTH_LOGOUT);
            });
    }
};

const mutations = {
    [USER_REQUEST]: state => {
        state.status = "loading";
    },
    [USER_SUCCESS]: (state, profile) => {
        state.status = "success";
        Vue.set(state, "profile", profile);
        localStorage.setItem("profile", JSON.stringify(profile));
    },
    [USER_ERROR]: state => {
        state.status = "error";
    },
    [AUTH_LOGOUT]: state => {
        state.profile = {};
        localStorage.removeItem("profile");
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
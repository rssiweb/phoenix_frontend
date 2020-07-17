import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from "../actions/user";
import faculty_service from "../../services/faculty";
import Vue from "vue";
import { AUTH_LOGOUT } from "../actions/auth";

const state = { status: "", profile: JSON.parse(localStorage.getItem("profile") || "{}") };

const getters = {
    getProfile: state => state.profile,
    isProfileLoaded: state => !!state.profile.name
};

const actions = {
    [USER_REQUEST]: ({ commit, dispatch }, id) => {
        commit(USER_REQUEST);
        faculty_service.get_profile(id)
            .then(profile => {

                commit(USER_SUCCESS, profile);
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
        localStorage.setItem("profile", JSON.stringify(profile));
        Vue.set(state, "profile", profile);
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
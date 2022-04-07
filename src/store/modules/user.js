import { AUTH_LOGOUT, REQUEST_, SUCCESS_, ERROR_ } from "@/store/actions";
import faculty_service from "../../services/faculty";
import Vue from "vue";

const state = { status: "", profile: JSON.parse(localStorage.getItem("profile") || "{}") };

const getters = {
    getProfile: state => state.profile,
    isProfileLoaded: state => !!state.profile.name
};

const actions = {
    [REQUEST_]: ({ commit, dispatch }, id) => {
        commit(REQUEST_);
        faculty_service.get_profile(id)
            .then(profile => {

                commit(SUCCESS_, profile);
            })
            .catch(() => {
                commit(ERROR_);
                // if resp is unauthorized, logout, to
                dispatch(AUTH_LOGOUT);
            });
    }
};

const mutations = {
    [REQUEST_]: state => {
        state.status = "loading";
    },
    [SUCCESS_]: (state, profile) => {
        state.status = "success";
        localStorage.setItem("profile", JSON.stringify(profile));
        Vue.set(state, "profile", profile);
    },
    [ERROR_]: state => {
        state.status = "error";
    },
    [AUTH_LOGOUT]: state => {
        state.profile = {};
        localStorage.removeItem("profile");
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
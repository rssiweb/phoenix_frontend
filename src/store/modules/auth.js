import { REQUEST_, SUCCESS_, ERROR_, LOGOUT_ } from "@/store/actions";
import { backend, token_service } from "@/services";
const state = {
  token: localStorage.getItem("token") || "",
  loading: false,
  success: null,
  username: localStorage.getItem("username") || "",
  id: localStorage.getItem("id") || "",
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  status: (state) => state.status,
  loading: (state) => state.loading,
  authUsername: (state) => state.username,
  authId: (state) => state.id,
};

const actions = {
  [REQUEST_]: ({ commit }, data) => {
    return new Promise((resolve, reject) => {
      commit(REQUEST_);
      token_service
        .post({ username: data.email, password: data.password })
        .then((res) => {
          commit(SUCCESS_, res);
          backend.defaults.headers.common[
            "Authorization"
          ] = `Token ${res.token}`;
          resolve(res);
        })
        .catch((err) => {
          commit(ERROR_, err);
          reject(err);
        });
    });
  },
  [LOGOUT_]: ({ commit }) => {
    return new Promise((resolve) => {
      commit(LOGOUT_);
      delete backend.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      resolve();
    });
  },
};

const mutations = {
  [REQUEST_]: (state) => {
    state.loading = true;
  },
  [SUCCESS_]: (state, res) => {
    localStorage.setItem("id", res.id);
    localStorage.setItem("token", res.token);
    localStorage.setItem("username", res.username);
    state.token = res.token;
    state.username = res.username;
    state.id = res.id;
    state.loading = false;
    state.success = true;
  },
  [ERROR_]: (state) => {
    state.loading = false;
    state.success = false;
  },
  [LOGOUT_]: (state) => {
    state.token = "";
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

import { CREATE_, REQUEST_, SUCCESS_, ERROR_ } from "@/store/actions";
import { classoccurrence_service } from "@/services";

const state = {
  success: null,
  loading: false,
  class_occurrences: JSON.parse(
    localStorage.getItem("classoccurrence") || "[]"
  ),
};

const getters = {
  class_occurrences: (state) => state.class_occurrences,
  occurrence_loading: (state) => state.loading,
};

const actions = {
  [CREATE_]: ({ commit }, payload) => {
    return new Promise((resolve, reject) => {
      commit(REQUEST_);
      classoccurrence_service
        .post(payload)
        .then((res) => {
          commit(CREATE_, res);
          resolve(res);
        })
        .catch((error) => {
          commit(ERROR_);
          reject(error);
        });
    });
  },
  [REQUEST_]: ({ commit }, query) => {
    return new Promise((resolve, reject) => {
      commit(REQUEST_);
      classoccurrence_service
        .get(query)
        .then((res) => {
          commit(SUCCESS_, res.results);
          resolve(res.results);
        })
        .catch((error) => {
          commit(ERROR_);
          reject(error);
        });
    });
  },
};

const mutations = {
  [REQUEST_]: (state) => {
    state.loading = true;
  },
  [CREATE_]: (state, class_occurrence) => {
    state.class_occurrences.splice(0, state.class_occurrences.length);
    state.class_occurrences.push(class_occurrence);
    state.success = true;
    state.loading = false;
  },
  [SUCCESS_]: (state, classoccurrences) => {
    state.class_occurrences.splice(0, state.class_occurrences.length);
    classoccurrences.forEach((item) => {
      state.class_occurrences.push(item);
    });
    state.success = true;
    state.loading = false;
  },
  [ERROR_]: (state) => {
    state.success = false;
    state.loading = false;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

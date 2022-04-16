import { VISIBLE_ } from "@/store/actions";

const state = {
  visible: localStorage.getItem("visible") || "false" == "true",
};

const getters = {
  menuIsVisible: (state) => state.visible,
};

const actions = {
  [VISIBLE_]: ({ commit }, visible) => {
    commit(VISIBLE_, visible);
  },
};

const mutations = {
  [VISIBLE_]: (state, visible) => {
    state.visible = visible;
    localStorage.setItem("visible", state.visible);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

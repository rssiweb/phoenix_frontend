import { ATTENDANCE_, SUCCESS_, ERROR_, AUTH_LOGOUT } from "@/store/actions";
import { attendance_service } from "@/services";
import Vue from "vue";

const state = {
  success: null,
  loading: false,
  attendance_report: JSON.parse(
    localStorage.getItem("attendance_report") || "[]"
  ),
};

const getters = {
  getReport: (state) => state.attendance_report,
};

const actions = {
  [ATTENDANCE_]: ({ commit }, month) => {
    commit(ATTENDANCE_);
    attendance_service
      .get({ month: month }, "timesheet")
      .then((resp) => {
        commit(SUCCESS_, resp);
      })
      .catch(() => {
        commit(ERROR_);
      });
  },
};

const mutations = {
  [ATTENDANCE_]: (state) => {
    state.loading = true;
  },
  [SUCCESS_]: (state, items) => {
    localStorage.setItem("attendance_report", JSON.stringify(items));
    Vue.set(state, "attendance_report", items);
    state.success = true;
    state.loading = false;
  },
  [ERROR_]: (state) => {
    state.success = false;
    state.loading = false;
  },
  [AUTH_LOGOUT]: (state) => {
    state.attendance_report = [];
    localStorage.removeItem("attendance_report");
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

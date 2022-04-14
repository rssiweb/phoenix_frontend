import { REGISTER_, SUCCESS_, ERROR_, REQUEST_ } from "@/store/actions";
import { attendance_service, classroom_service } from "@/services";
// private actions
const ATTENDANCES_LOADED = "ATTENDANCES_LOADED";
const state = {
  loading: false,
  success: null,
  attendances: JSON.parse(localStorage.getItem("attendances") || "[]"),
};

const getters = {
  attendance: (state) => state.attendance,
};

const actions = {
  [REQUEST_]: ({ commit }, class_id) => {
    return new Promise((resolve, reject) => {
      commit(REQUEST_);
      classroom_service
        .get({}, `${class_id}/attendance_by_student`)
        .then((res) => {
          commit(ATTENDANCES_LOADED, res);
          return resolve(res);
        })
        .catch((error) => {
          commit(ERROR_, error);
          return reject(error);
        });
    });
  },
  [REGISTER_]: ({ commit }, payload) => {
    return new Promise((resolve, reject) => {
      commit(REGISTER_);
      var args = [payload];
      var method = "post";
      if (payload.attendance_id) {
        method = "patch";
        args.push(this.attendance_id);
        delete payload["attendance_id"];
      }
      attendance_service[method](...args)
        .then((res) => {
          // dispatch() and event to add this attendance to list of attendance we have
          commit(SUCCESS_, res);
          resolve(res);
        })
        .catch((err) => {
          commit(ERROR_, err);
          reject(err);
        });
    });
  },
};

const mutations = {
  [REQUEST_]: (state) => {
    state.loading = true;
  },
  [REGISTER_]: (state) => {
    state.loading = true;
  },
  [ATTENDANCES_LOADED]: (state, attendances) => {
    state.attendances.splice(0, state.attendances);
    attendances.forEach((item) => {
      state.attendances.push(item);
    });
    state.loading = false;
    state.success = true;
  },
  [SUCCESS_]: (state, res) => {
    state.attendances.push(res);
    state.loading = false;
    state.success = true;
  },
  [ERROR_]: (state) => {
    state.loading = false;
    state.success = false;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

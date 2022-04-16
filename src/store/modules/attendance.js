import { REGISTER_, ERROR_, REQUEST_ } from "@/store/actions";
import { attendance_service, classroom_service } from "@/services";
// private actions
const ATTENDANCES_LOADED = "ATTENDANCES_LOADED";
const NEW = "NEW";
const UPDATE = "UPDATE";

const state = {
  session: "",
  loading: false,
  success: null,
  attendances: JSON.parse(localStorage.getItem("attendances") || "[]"),
};

const getters = {
  attendances: (state) => state.attendances,
  loading: (state) => state.loading,
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
        args.push(payload.attendance_id);
        // delete payload["attendance_id"];
      }
      attendance_service[method](...args)
        .then((res) => {
          // dispatch() and event to add this attendance to list of attendance we have
          if (method === "post") commit(NEW, res);
          else
            commit(
              UPDATE,
              Object.assign({}, res, {
                id: payload.attendance_id,
                student: payload.student,
              })
            );
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
    state.attendances.splice(0, state.attendances.length);
    attendances.forEach((item) => {
      state.attendances.push(item);
    });
    state.loading = false;
    state.success = true;
  },
  [NEW]: (state, res) => {
    console.log("insert");
    // we need to know if its a new attendance record or and update

    // res is an attendance entry
    // state.attendances is the list of students
    state.attendances.forEach((student) => {
      console.log(res, res.student, student.id);
      if (res.student === student.id) {
        student.attendance.push({
          attendance: res.attendance,
          comment: res.comment,
          date: res.date,
          id: res.id,
        });
        console.log("added");
      }
    });
    state.loading = false;
    state.success = true;
  },
  [UPDATE]: (state, res) => {
    console.log("update");
    // we need to know if its a new attendance record or and update

    // res is an attendance entry
    // state.attendances is the list of students
    state.attendances.forEach((student) => {
      console.log(res, res.student, student.id);
      if (res.student === student.id) {
        student.attendance.forEach((record) => {
          if (record.id == res.id) {
            record.attendance = res.attendance;
            record.comment = res.comment;
            console.log("udpated");
          }
        });
      }
    });
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

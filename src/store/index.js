import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import auth from "./modules/auth";
import classoccurrence from "./modules/classoccurrence";
import attendance from "./modules/attendance";
import report from "./modules/report";
import menu from "./modules/menu";
import global from "./modules/global";
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    user,
    auth,
    classoccurrence,
    attendance,
    menu,
    global,
    report,
  },
  strict: debug,
});

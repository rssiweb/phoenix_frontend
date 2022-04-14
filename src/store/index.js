import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import auth from "./modules/auth";
import classoccurrence from "./modules/classoccurrence";
import attendance from "./modules/attendance";
import menu from "./modules/menu";
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    user,
    auth,
    classoccurrence,
    attendance,
    menu,
  },
  strict: debug,
});

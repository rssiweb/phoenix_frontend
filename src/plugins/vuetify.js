import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: "#2196f3",
        secondary: "#ff9800",
        accent: "#03a9f4",
        error: "#f44336",
        warning: "#ff9800",
        info: "#03a9f4",
        success: "#4caf50",
      },
    },
  },
  icons: {
    iconfont: "fa",
  },
});

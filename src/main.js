import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuelidate from 'vuelidate'
import { MdButton, MdField, MdMenu, MdCard, MdList, MdProgress } from 'vue-material/dist/components'
import '@/scss/style.scss';

Vue.use(Vuelidate)
Vue.use(MdButton)
Vue.use(MdField)
Vue.use(MdMenu)
Vue.use(MdCard)
Vue.use(MdList)
Vue.use(MdProgress)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
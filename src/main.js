import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import axios from "axios"
import VueAxios from "vue-axios"
import vuetify from "./plugins/vuetify"
import i18n from "./i18n"

axios.defaults.baseURL = process.env.VUE_APP_NENKYUU_CALENDAR_API_URL

Vue.use(VueAxios, axios)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount("#app")

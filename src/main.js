import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import axios from "axios"
import VueAxios from "vue-axios"
import vuetify from "./plugins/vuetify"
import i18n from "./i18n"

// TODO: rename to something more specific
axios.defaults.baseURL = process.env.VUE_APP_API_URL

Vue.use(VueAxios, axios)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount("#app")

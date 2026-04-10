import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import { store, key } from "./store"
import axios from "axios"
import VueAxios from "vue-axios"
import vuetify from "./plugins/vuetify"
import i18n from "./i18n"
import { initToken, identify } from "./composables/useAuth"

axios.defaults.baseURL = import.meta.env.VITE_NENKYUU_CALENDAR_API_URL

async function init() {
  // Restore any stored auth token into axios headers before the first request
  initToken()

  // Identify the current user before mounting so the router guard has
  // accurate auth state on the very first navigation
  await identify()

  const app = createApp(App)
  app.use(router)
  app.use(store, key)
  app.use(vuetify)
  app.use(i18n)
  app.use(VueAxios, axios)
  app.mount("#app")
}

init()

import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import { store, key } from "./store"
import axios from "axios"
import VueAxios from "vue-axios"
import vuetify from "./plugins/vuetify"
import i18n from "./i18n"

axios.defaults.baseURL = import.meta.env.VUE_APP_NENKYUU_CALENDAR_API_URL

const app = createApp(App)
app.use(router)
app.use(store, key)
app.use(vuetify)
app.use(i18n)
app.use(VueAxios, axios)
app.mount("#app")

import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import axios from "axios"
import VueAxios from "vue-axios"
import vuetify from "./plugins/vuetify"
import i18n from "./i18n"
import { createAuthPlugin } from "@jtekt/vuetify-auth"
const {
  VITE_NENKYUU_CALENDAR_API_URL,
  VITE_OIDC_CLIENT_ID,
  VITE_OIDC_AUTHORITY,
  VITE_LOGIN_URL,
  VITE_AUTH_IDENTIFICATION_URL,
  VITE_AUTH_ENRICMENT_ID_FIELD,
} = import.meta.env

axios.defaults.baseURL = VITE_NENKYUU_CALENDAR_API_URL

const auth = createAuthPlugin(
  {
    oidc: {
      clientId: VITE_OIDC_CLIENT_ID,
      authority: VITE_OIDC_AUTHORITY,
      enrichmentEndpoint: VITE_AUTH_IDENTIFICATION_URL,
      identifierLookupField: VITE_AUTH_ENRICMENT_ID_FIELD,
    },
    credentials: {
      loginEndpoint: VITE_LOGIN_URL,
      identifierLookupField: VITE_AUTH_ENRICMENT_ID_FIELD,
    },
  },
  router
)

const app = createApp(App)
app.use(vuetify)
app.use(auth)
app.use(router)
app.use(i18n)
app.use(VueAxios, axios)
app.mount("#app")

import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import axios from "axios"
import VueAxios from "vue-axios"
import vuetify from "./plugins/vuetify"
import { i18n } from "./plugins/i18n"
import { createAuthPlugin } from "@jtekt/vuetify-auth"
import runtimeEnv from "@/runtimeEnv"
const {
  VITE_NENKYUU_CALENDAR_API_URL,
  VITE_OIDC_CLIENT_ID,
  VITE_OIDC_AUTHORITY,
  VITE_LOGIN_URL,
  VITE_AUTH_IDENTIFICATION_URL,
  VITE_AUTH_ENRICHMENT_ID_FIELD,
} = runtimeEnv

axios.defaults.baseURL = VITE_NENKYUU_CALENDAR_API_URL

const auth = createAuthPlugin(
  {
    strategies: {
      oidc: {
        clientId: VITE_OIDC_CLIENT_ID,
        authority: VITE_OIDC_AUTHORITY,
        enrichment: {
          endpoint: VITE_AUTH_IDENTIFICATION_URL,
        },
        identity: {
          source: "enrichment",
          identifierLookupField: VITE_AUTH_ENRICHMENT_ID_FIELD || "_id",
        },
      },
      credentials: {
        loginEndpoint: VITE_LOGIN_URL,
        identity: {
          identifierLookupField: VITE_AUTH_ENRICHMENT_ID_FIELD || "_id",
        },
      },
    },
    onAuthError: (error) => console.error("[Auth]", error),
    onSessionChange(session) {
      if (!session) {
        console.log("[SESSION] no session")
        delete axios.defaults.headers.common["Authorization"]
        return
      }
      const token = session.accessToken
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      } else {
        delete axios.defaults.headers.common["Authorization"]
      }
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

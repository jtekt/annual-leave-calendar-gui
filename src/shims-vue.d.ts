/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue"
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

interface ImportMetaEnv {
  readonly VUE_APP_NENKYUU_CALENDAR_API_URL?: string
  readonly VUE_APP_LOGIN_URL?: string
  readonly VUE_APP_IDENTIFICATION_URL?: string
  readonly VUE_APP_LOGIN_HINT?: string
  readonly VUE_APP_HOMEPAGE_URL?: string
  readonly VUE_APP_USER_MANAGER_API_URL?: string
  readonly VUE_APP_GROUP_MANAGER_API_URL?: string
  readonly VUE_APP_AUTHENTICATION_API_URL?: string
  readonly VUE_APP_API_URL?: string
  readonly VUE_APP_I18N_LOCALE?: string
  readonly VUE_APP_I18N_FALLBACK_LOCALE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

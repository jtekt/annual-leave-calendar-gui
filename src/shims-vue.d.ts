/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue"
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_NENKYUU_CALENDAR_API_URL?: string
  readonly VITE_LOGIN_URL?: string
  readonly VITE_IDENTIFICATION_URL?: string
  readonly VITE_LOGIN_HINT?: string
  readonly VITE_HOMEPAGE_URL?: string
  readonly VITE_USER_MANAGER_API_URL?: string
  readonly VITE_GROUP_MANAGER_API_URL?: string
  readonly VITE_AUTHENTICATION_API_URL?: string
  readonly VITE_API_URL?: string
  readonly VITE_I18N_LOCALE?: string
  readonly VITE_I18N_FALLBACK_LOCALE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

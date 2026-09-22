/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue"
  const component: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    unknown
  >
  export default component
}

interface ImportMetaEnv {
  readonly VITE_NENKYUU_CALENDAR_API_URL?: string
  readonly VITE_LOGIN_URL?: string
  readonly VITE_AUTH_IDENTIFICATION_URL?: string
  readonly VITE_AUTH_ENRICHMENT_ID_FIELD?: string
  readonly VITE_LOGIN_HINT?: string
  readonly VITE_APPS_URL?: string
  readonly VITE_USER_MANAGER_API_URL?: string
  readonly VITE_GROUP_MANAGER_API_URL?: string
  readonly VITE_AUTHENTICATION_API_URL?: string
  readonly VITE_API_URL?: string
  readonly VITE_I18N_LOCALE?: string
  readonly VITE_I18N_FALLBACK_LOCALE?: string
  readonly VITE_OIDC_AUTHORITY?: string
  readonly VITE_OIDC_CLIENT_ID?: string
  readonly VITE_MINIMUM_LEAVES?: string
  readonly VITE_LEAVE_TYPES_FULL_DAY?: string
  readonly VITE_LEAVE_TYPES_MORNING?: string
  readonly VITE_LEAVE_TYPES_AFTERNOON?: string
  readonly VITE_LEAVE_TYPES_EXCLUDED?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  __ENV__?: Record<string, string>
}

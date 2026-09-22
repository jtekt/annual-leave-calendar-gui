import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import ja from '../locales/ja.json'
import { en as VuetifyEn, ja as VuetifyJa } from 'vuetify/locale'
import { localStorageKeys } from '../constants'
import runtimeEnv from '@/runtimeEnv'

export default createI18n({
  legacy: false,
  locale: localStorage.getItem(localStorageKeys.locale) || runtimeEnv.VITE_I18N_LOCALE || 'ja',
  fallbackLocale: runtimeEnv.VITE_I18N_FALLBACK_LOCALE || 'en',
  messages: {
    en: {
      ...en,
      $vuetify: VuetifyEn,
    },
    ja: {
      ...ja,
      $vuetify: VuetifyJa,
    },
  },
})

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { watch } from 'vue'
import { createVuetify } from 'vuetify'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import { useI18n } from 'vue-i18n'
import { i18n } from './i18n'

const THEME_STORAGE_KEY = 'theme'

// Components and directives are auto-imported by vite-plugin-vuetify
const vuetify = createVuetify({
  defaults: {
    VTextField: { variant: 'underlined' },
    VTextarea: { variant: 'underlined' },
    VSelect: { variant: 'outlined' },
    VCombobox: { variant: 'outlined' },
    VAutocomplete: { variant: 'outlined' },
    VFileInput: { variant: 'outlined' },
    VSwitch: { color: 'primary' },
    VTabs: { color: 'primary' },
  },
  theme: {
    defaultTheme: localStorage.getItem(THEME_STORAGE_KEY) || 'light',
    themes: {
      light: {
        colors: {
          primary: '#b00000',
          background: '#f5f5f5',
          // App-specific colours
          secondary: '#a25959',
          'allocations-current-year': '#539dcf',
          'allocations-carried-over': '#5877c5',
        },
      },
      dark: {
        colors: {
          primary: '#b02222',
          // App-specific colours
          secondary: '#a25959',
          'allocations-current-year': '#539dcf',
          'allocations-carried-over': '#5877c5',
          'leaves-taken': '#666666',
          'leaves-future': '#888888',
        },
      },
    },
  },
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
})

// Remember the user's theme choice
watch(vuetify.theme.global.name, (name) => {
  localStorage.setItem(THEME_STORAGE_KEY, name)
})

export default vuetify

import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"
import "vuetify/styles"
import "@mdi/font/css/materialdesignicons.css"

export default createVuetify({
  components,
  directives,
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#c00000",
        },
      },
      dark: {
        colors: {
          primary: "#c00000",
        },
      },
    },
  },
})

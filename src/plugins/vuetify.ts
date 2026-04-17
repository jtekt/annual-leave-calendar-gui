import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"
import "vuetify/styles"
import "@mdi/font/css/materialdesignicons.css"

export default createVuetify({
  components,
  directives,
  defaults: {
    VTextField: { variant: "outlined" },
    VSelect: { variant: "outlined" },
  },

  theme: {
    themes: {
      light: {
        colors: {
          primary: "#c00000",
          background: "#f5f5f5",
          "allocations-current-year": "#539dcf",
          "allocations-carried-over": "#5877c5",
          "leaves-taken": "#666666",
          "leaves-future": "#888888",
        },
      },
      dark: {
        colors: {
          primary: "#c00000",
          "allocations-current-year": "#539dcf",
          "allocations-carried-over": "#5877c5",
          "leaves-taken": "#666666",
          "leaves-future": "#888888",
        },
      },
    },
  },
})

<template>
  <AppTemplate :options="options" @user="get_user($event)">
    <template v-slot:nav>
      <v-list dense nav>
        <v-list-item>
          <LocaleSelector />
        </v-list-item>
        <v-divider />

        <v-list-item
          v-for="(item, index) in nav"
          :key="`nav_item_${index}`"
          :to="item.to"
          exact
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </AppTemplate>
</template>

<script>
import AppTemplate from "@moreillon/vue_application_template_vuetify"
import LocaleSelector from "./components/LocaleSelector.vue"

const {
  VUE_APP_LOGIN_URL,
  VUE_APP_IDENTIFICATION_URL,
  VUE_APP_LOGIN_HINT,
  VUE_APP_HOMEPAGE_URL,
} = process.env

export default {
  name: "App",

  components: {
    AppTemplate,
    LocaleSelector,
  },

  data: () => ({
    options: {
      title: "年休カレンダー",
      login_url: VUE_APP_LOGIN_URL,
      identification_url: VUE_APP_IDENTIFICATION_URL,
      header_logo: require("@/assets/jtekt_logo_negative.jpg"),
      authentication_logo: require("@/assets/jtekt_logo.jpg"),
      colors: { app_bar: "#000" },
      author: "Maxime Moreillon - JTEKT Corporation",
      login_hint: VUE_APP_LOGIN_HINT,
      homepage_url: VUE_APP_HOMEPAGE_URL,
    },
  }),

  methods: {
    get_user(user) {
      this.$store.commit("set_current_user", user)
    },
  },
  computed: {
    nav() {
      return [
        {
          title: this.$t("Create entry"),
          to: { name: "new_entry" },
          icon: "mdi-plus",
        },
        {
          title: this.$t("My entries"),
          to: { name: "user_entries", params: { id: "self" } },
          icon: "mdi-account",
        },
        {
          title: this.$t("My allocations"),
          to: { name: "user_allocations", params: { id: "self" } },
          icon: "mdi-account",
        },
        {
          title: this.$t("Groups"),
          to: { name: "groups" },
          icon: "mdi-account-multiple",
        },
        {
          title: this.$t("About"),
          to: { name: "about" },
          icon: "mdi-information-outline",
        },
      ]
    },
  },
}
</script>

<style>
.header_logo {
  border-right: 1px solid white;
}
</style>

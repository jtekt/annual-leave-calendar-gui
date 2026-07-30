<template>
  <v-app>
    <template v-if="!isLoginRoute">
      <v-app-bar :color="colors.app_bar">
        <v-app-bar-nav-icon @click="drawer = !drawer" v-if="session" />
        <v-app-bar-title>Leaves calendar</v-app-bar-title>
        <template #append>
          <LocaleSelector />
          <ThemeToggler />
          <v-btn v-if="VITE_APPS_URL" :href="VITE_APPS_URL" icon="mdi-apps" />
          <v-btn v-if="session" icon="mdi-logout" @click="logout" />
        </template>
      </v-app-bar>

      <v-navigation-drawer v-if="session" v-model="drawer">
        <v-list nav>
          <template v-for="(item, index) in nav" :key="index">
            <v-divider v-if="item.divider" />
            <v-list-item
              v-else
              :to="item.to"
              :prepend-icon="item.icon"
              :title="item.title"
              exact
            />
          </template>
        </v-list>
      </v-navigation-drawer>
    </template>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { useRoute } from "vue-router"
import { useI18n } from "vue-i18n"
import LocaleSelector from "./components/LocaleSelector.vue"
import ThemeToggler from "./components/ThemeToggler.vue"
const { t, locale } = useI18n()
const route = useRoute()
import { useAxiosAuth } from "@/composables/useAxiosAuth"
import { useAuth } from "@jtekt/vuetify-auth"
import { localStorageKeys } from "./constants"

useAxiosAuth()

const { session, logout } = useAuth()
const drawer = ref(true)
const colors = { app_bar: "#000" }

const isLoginRoute = computed(() => route.name === "login")

const { VITE_APPS_URL } = import.meta.env

const nav = computed(() => [
  {
    title: t("Create entry"),
    to: { name: "new_entry" },
    icon: "mdi-calendar-plus",
  },
  {
    title: t("Register allocations"),
    to: { name: "register_allocations", params: { id: "self" } },
    icon: "mdi-calendar-outline",
  },
  { divider: true },
  {
    title: t("My entries"),
    to: { name: "user_entries", params: { id: "self" } },
    icon: "mdi-account",
  },
  {
    title: t("User search"),
    to: { name: "user_search" },
    icon: "mdi-account-search",
  },
  {
    title: t("Groups"),
    to: { name: "groups" },
    icon: "mdi-account-multiple",
  },
  { divider: true },
  {
    title: t("About"),
    to: { name: "about" },
    icon: "mdi-information-outline",
  },
])

// Watch the locale
watch(locale, (newLocale) => {
  // Update the document language attribute
  document.documentElement.setAttribute('lang', newLocale)

  // Save in local storage on change
  localStorage.setItem(localStorageKeys.locale, locale.value);
}, { immediate: true })
</script>

<style>
.header_logo {
  border-right: 1px solid white;
}
</style>

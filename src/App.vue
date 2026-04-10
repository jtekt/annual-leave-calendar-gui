<template>
  <v-app>
    <template v-if="!isLoginRoute">
      <v-app-bar :color="colors.app_bar">
        <v-app-bar-nav-icon @click="drawer = !drawer" />
        <v-app-bar-title class="text-white">年休カレンダー</v-app-bar-title>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer">
        <v-list nav>
          <v-list-item>
            <LocaleSelector />
          </v-list-item>
          <v-divider />
          <v-list-item
            v-for="(item, index) in nav"
            :key="`nav_item_${index}`"
            :to="item.to"
            :prepend-icon="item.icon"
            :title="item.title"
            exact
          />
          <v-divider class="mt-auto" />
          <v-list-item
            v-if="current_user"
            prepend-icon="mdi-account-circle-outline"
            :title="current_user.display_name || current_user.name_kanji || ''"
            :subtitle="t('Logged in')"
          />
          <v-list-item
            v-if="isAuthEnabled"
            prepend-icon="mdi-logout"
            :title="t('Logout')"
            @click="handleLogout"
          />
        </v-list>
      </v-navigation-drawer>
    </template>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { useStore } from "@/store"
import { useAuth } from "@/composables/useAuth"
import LocaleSelector from "./components/LocaleSelector.vue"

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useStore()
const { logout } = useAuth()

const drawer = ref(true)
const colors = { app_bar: "#000" }

const isLoginRoute = computed(() => route.name === "login")
const isAuthEnabled = computed(() => !!import.meta.env.VITE_IDENTIFICATION_URL)
const current_user = computed(() => store.state.current_user)

function handleLogout() {
  logout()
  router.push({ name: "login" })
}

const nav = computed(() => [
  {
    title: t("Create entry"),
    to: { name: "new_entry" },
    icon: "mdi-plus",
  },
  {
    title: t("My entries"),
    to: { name: "user_entries", params: { id: "self" } },
    icon: "mdi-account",
  },
  {
    title: t("My allocations"),
    to: { name: "user_allocations", params: { id: "self" } },
    icon: "mdi-account",
  },
  {
    title: t("Groups"),
    to: { name: "groups" },
    icon: "mdi-account-multiple",
  },
  {
    title: t("About"),
    to: { name: "about" },
    icon: "mdi-information-outline",
  },
])
</script>

<style>
.header_logo {
  border-right: 1px solid white;
}
</style>

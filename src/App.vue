<template>
  <v-app>
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
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useStore } from "@/store"
import axios from "axios"
import LocaleSelector from "./components/LocaleSelector.vue"

const { t } = useI18n()
const store = useStore()

const drawer = ref(true)
const colors = { app_bar: "#000" }

const VUE_APP_LOGIN_URL = import.meta.env.VUE_APP_LOGIN_URL
const VUE_APP_IDENTIFICATION_URL = import.meta.env.VUE_APP_IDENTIFICATION_URL

function identify() {
  if (!VUE_APP_IDENTIFICATION_URL) return
  axios
    .get(VUE_APP_IDENTIFICATION_URL)
    .then(({ data }) => {
      store.commit("set_current_user", data)
    })
    .catch((error: { response?: { status: number } }) => {
      if (error.response?.status === 401 && VUE_APP_LOGIN_URL) {
        window.location.href = VUE_APP_LOGIN_URL
      } else {
        console.error(error)
      }
    })
}

onMounted(() => identify())

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

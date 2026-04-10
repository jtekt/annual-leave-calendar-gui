<template>
  <v-card max-width="30rem" class="mx-auto" prepend-icon="mdi-information">
    <template #title>年休カレンダー</template>
    <v-divider />
    <v-card-text>
      <p>Developped by Maxime MOREILLON</p>
      <p>Version {{ version }}</p>
      <p>API URL: {{ api_url }}</p>
      <p>User manager API URL: {{ user_manager_api_url }}</p>
      <p>Authentication API URL: {{ authentication_api_url }}</p>
      <p>Group manager API URL: {{ group_manager_api_url }}</p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import pjson from "../../package.json"

const version = pjson.version
const api_url = import.meta.env.VITE_API_URL
const group_manager_api_url = import.meta.env.VITE_GROUP_MANAGER_API_URL
const authentication_api_url = import.meta.env.VITE_AUTHENTICATION_API_URL
const user_manager_api_url = import.meta.env.VITE_USER_MANAGER_API_URL
</script>

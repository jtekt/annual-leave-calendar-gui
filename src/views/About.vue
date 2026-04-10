<template>
  <v-card
    max-width="30rem"
    class="mx-auto"
    prepend-icon="mdi-information"
    title="年休カレンダー"
  >
    <v-card-text>
      <v-list>
        <v-list-item title="Developer" subtitle="Maxime MOREILLON" />
        <v-list-item title="Version" :subtitle="version" />
        <v-divider />
        <v-list-item
          title="API URL"
          :subtitle="VITE_NENKYUU_CALENDAR_API_URL"
        />
        <v-list-item
          title="User manager API URL"
          :subtitle="VITE_USER_MANAGER_API_URL"
        />
        <v-list-item title="Login URL" :subtitle="VITE_LOGIN_URL" />
        <v-list-item
          title="Identification URL"
          :subtitle="VITE_IDENTIFICATION_URL"
        />
        <v-list-item
          title="Group manager API URL"
          :subtitle="VITE_GROUP_MANAGER_API_URL"
        />
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import pjson from "../../package.json"

const {
  VITE_NENKYUU_CALENDAR_API_URL,
  VITE_GROUP_MANAGER_API_URL,
  VITE_USER_MANAGER_API_URL,
  VITE_LOGIN_URL,
  VITE_IDENTIFICATION_URL,
} = import.meta.env

const version = pjson.version
</script>

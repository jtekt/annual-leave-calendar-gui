<template>
  <v-card
    max-width="30rem"
    class="mx-auto"
    prepend-icon="mdi-information"
    :title="t('App title')"
  >
    <v-card-text>
      <v-list>
        <v-list-item :title="t('Developer')" subtitle="Maxime MOREILLON" />
        <v-list-item :title="t('Version')" :subtitle="version" />
        <v-divider />
        <v-list-item
          :title="t('API URL')"
          :subtitle="VITE_NENKYUU_CALENDAR_API_URL"
        />
        <v-list-item
          :title="t('User manager API URL')"
          :subtitle="VITE_USER_MANAGER_API_URL"
        />
        <v-list-item :title="t('Login URL')" :subtitle="VITE_LOGIN_URL" />
        <v-list-item
          :title="t('Identification URL')"
          :subtitle="VITE_IDENTIFICATION_URL"
        />
        <v-list-item
          :title="t('Group manager API URL')"
          :subtitle="VITE_GROUP_MANAGER_API_URL"
        />
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import pjson from "../../package.json"

const { t } = useI18n()

const {
  VITE_NENKYUU_CALENDAR_API_URL,
  VITE_GROUP_MANAGER_API_URL,
  VITE_USER_MANAGER_API_URL,
  VITE_LOGIN_URL,
  VITE_IDENTIFICATION_URL,
} = import.meta.env

const version = pjson.version
</script>

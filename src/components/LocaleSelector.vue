<template>
  <v-select
    prepend-inner-icon="mdi-translate"
    :items="locales"
    v-model="locale"
    hide-details
    variant="outlined"
    density="compact"
    width="150px"
  />
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"

const { locale } = useI18n({ useScope: "global" })

const locales = [
  { title: "English", value: "en" },
  { title: "日本語", value: "ja" },
]
</script>

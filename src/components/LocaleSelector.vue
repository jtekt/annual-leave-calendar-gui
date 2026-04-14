<template>
  <v-select
    prepend-inner-icon="mdi-translate"
    :items="locales"
    v-model="locale"
    hide-details
    variant="outlined"
    density="compact"
  />
</template>

<script setup lang="ts">
import { watch } from "vue"
import { useI18n } from "vue-i18n"

const { locale } = useI18n({ useScope: "global" })

const locales = [
  { title: "English", value: "en" },
  { title: "日本語", value: "ja" },
]

const savedLocale = localStorage.getItem("locale")
if (savedLocale) locale.value = savedLocale

watch(locale, (newLocale) => {
  localStorage.setItem("locale", newLocale)
})
</script>

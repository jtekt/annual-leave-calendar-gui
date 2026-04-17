<template>
  <v-select
    :items="yearItems"
    v-model="year"
    :label="t('Year')"
    hide-details
    variant="outlined"
    density="compact"
    max-width="150px"
  />
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { useYear } from "@/composables/useYear"

const { t } = useI18n()
const { year, yearItems } = useYear()
</script>

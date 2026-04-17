<template>
  <v-btn-toggle v-model="mode" mandatory variant="outlined" density="compact">
    <v-btn value="grid" icon="mdi-calendar-month" />
    <v-btn value="dates" icon="mdi-calendar-text" />
  </v-btn-toggle>
</template>

<script setup lang="ts">
import { useCalendarDisplayMode } from "@/composables/useCalendarDisplayMode"

const { mode } = useCalendarDisplayMode()
</script>

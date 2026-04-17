<template>
  <v-row dense>
    <v-col v-for="month in 12" :key="`month_${month}`" cols="2" sm="1">
      <!-- <v-card
        variant="outlined"
        class="month"
        height="100%"
        :class="{
          ellapsed: current_month > month || current_year > year,
          current: current_month === month && current_year === year,
        }"
      > -->
      <div class="month_header">{{ t("month label", { month }) }}</div>
      <MonthDayGrid :entries="entries" :month="month" :year="year" />
      <!-- </v-card> -->
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"
import { useI18n } from "vue-i18n"
import type { Entry } from "@/types"
import MonthDayGrid from "@/components/MonthDayGrid.vue"

const props = defineProps<{
  entries: Entry[]
}>()

const { t } = useI18n()
const route = useRoute()

const current_month = computed(() => new Date().getMonth() + 1)
const current_year = computed(() => new Date().getFullYear())
const year = computed(
  () => Number(route.query.year) || new Date().getFullYear()
)
</script>

<style scoped>
.month {
  padding: 0.25em;
}

.month.ellapsed {
  background-color: #aaaaaa33;
}

.month.current {
  border-width: 2px;
}

.month_header {
  text-align: left;
  opacity: 0.5;
  font-size: 80%;
}
</style>

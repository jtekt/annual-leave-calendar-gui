<template>
  <v-row dense>
    <v-col v-for="month in 12" :key="`month_${month}`" cols="2" sm="1">
      <v-card
        variant="outlined"
        class="month"
        height="100%"
        :class="{
          ellapsed: current_month > month || current_year > year,
          current: current_month === month && current_year === year,
        }"
      >
        <div class="month_header">{{ t("month label", { month }) }}</div>

        <MonthDayGrid
          v-if="calendarDisplayMode === 'grid'"
          :entries="entries_of_month(month)"
          :month="month"
        />
        <MonthDayEntries
          v-else
          :entries="entries_of_month(month)"
          :month="month"
        />
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import type { Entry } from "@/types"
import MonthDayGrid from "@/components/MonthDayGrid.vue"
import MonthDayEntries from "@/components/MonthDayEntries.vue"
import { useCalendarDisplayMode } from "@/composables/useCalendarDisplayMode"
import { useYear } from "@/composables/useYear"

const props = defineProps<{
  entries: Entry[]
}>()

const { t } = useI18n()
const { mode: calendarDisplayMode } = useCalendarDisplayMode()
const { year } = useYear()

const current_month = computed(() => new Date().getMonth() + 1)
const current_year = computed(() => new Date().getFullYear())

function entries_of_month(month: number): Entry[] {
  return props.entries.filter(({ date, type }) => {
    return (
      new Date(date).getMonth() + 1 === month &&
      ["有休", "前半休", "後半休"].includes(type)
    )
  })
}
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

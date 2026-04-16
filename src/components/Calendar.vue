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
        <div class="day-grid">
          <div
            v-for="n in first_day_offset(month)"
            :key="`offset_${n}`"
            class="day-cell offset"
          />
          <component
            :is="entry_for_day(month, day) ? 'router-link' : 'div'"
            v-for="day in days_in_month(month)"
            :key="`day_${day}`"
            :to="
              entry_for_day(month, day)
                ? { name: 'entry', params: { id: entry_for_day(month, day)!._id } }
                : undefined
            "
            class="day-cell"
            :class="day_cell_class(month, day)"
          />
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"
import { useI18n } from "vue-i18n"
import type { Entry } from "@/types"

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

function entries_of_month(month: number): Entry[] {
  return props.entries.filter(({ date, type }) => {
    return (
      new Date(date).getMonth() + 1 === month &&
      ["有休", "前半休", "後半休"].includes(type)
    )
  })
}

function days_in_month(month: number): number {
  return new Date(year.value, month, 0).getDate()
}

function first_day_offset(month: number): number {
  const day = new Date(year.value, month - 1, 1).getDay()
  return (day + 6) % 7 // Monday-start: Sun=6, Mon=0, ..., Sat=5
}

function entry_for_day(month: number, day: number): Entry | undefined {
  return entries_of_month(month).find((e) => new Date(e.date).getDate() === day)
}

function is_future_day(month: number, day: number): boolean {
  if (year.value !== current_year.value) return year.value > current_year.value
  if (month !== current_month.value) return month > current_month.value
  return day >= new Date().getDate()
}

function day_cell_class(month: number, day: number): Record<string, boolean> {
  const isFuture = is_future_day(month, day)

  const entry = entry_for_day(month, day)
  if (!entry) return { "future-day": isFuture }

  const isAm = (entry.am && !entry.pm) || entry.type === "前半休"
  const isPm = (entry.pm && !entry.am) || entry.type === "後半休"

  return {
    "has-entry": true,
    "am-half": isAm,
    "pm-half": isPm,
    "future-day": isFuture,
    "refresh-entry": !!entry.refresh,
  }
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

.day-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-top: 2px;
}

.day-cell {
  --empty-bg: rgba(128, 128, 128, 0.45);
  aspect-ratio: 1;
  border-radius: 1px;
  background-color: var(--empty-bg);
}

.day-cell.offset {
  background-color: transparent;
}

.day-cell.future-day {
  --empty-bg: rgba(128, 128, 128, 0.07);
}

.day-cell.future-day:not(.has-entry) {
  background-color: var(--empty-bg);
}

.day-cell.has-entry {
  background-color: rgb(var(--v-theme-primary));
  cursor: pointer;
  text-decoration: none;
}

.day-cell.has-entry.am-half {
  background: linear-gradient(
    to bottom right,
    rgb(var(--v-theme-primary)) 50%,
    var(--empty-bg) 50%
  );
}

.day-cell.has-entry.pm-half {
  background: linear-gradient(
    to bottom right,
    var(--empty-bg) 50%,
    rgb(var(--v-theme-primary)) 50%
  );
}

.day-cell.has-entry.future-day {
  opacity: 0.4;
}

.day-cell.has-entry.refresh-entry {
  outline: 1px solid rgb(14, 205, 122);
  outline-offset: -1px;
}
</style>

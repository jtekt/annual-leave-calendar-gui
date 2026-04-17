<template>
  <div class="day-grid">
    <div
      v-for="n in first_day_offset"
      :key="`offset_${n}`"
      class="day-cell offset"
    />
    <component
      :is="entry_for_day(day) ? 'router-link' : 'div'"
      v-for="day in days_in_month"
      :key="`day_${day}`"
      :to="
        entry_for_day(day)
          ? { name: 'entry', params: { id: entry_for_day(day)!._id } }
          : undefined
      "
      class="day-cell"
      :class="day_cell_class(day)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { Entry } from "@/types"

const props = defineProps<{
  entries: Entry[]
  month: number
  year: number
}>()

const current_month = new Date().getMonth() + 1
const current_year = new Date().getFullYear()
const today = new Date().getDate()

const month_entries = computed(() =>
  props.entries.filter(({ date, type }) => {
    return (
      new Date(date).getMonth() + 1 === props.month &&
      ["有休", "前半休", "後半休"].includes(type)
    )
  })
)

const days_in_month = computed(() =>
  new Date(props.year, props.month, 0).getDate()
)

const first_day_offset = computed(() => {
  const day = new Date(props.year, props.month - 1, 1).getDay()
  return (day + 6) % 7 // Monday-start: Sun=6, Mon=0, ..., Sat=5
})

function entry_for_day(day: number): Entry | undefined {
  return month_entries.value.find((e) => new Date(e.date).getDate() === day)
}

function is_future_day(day: number): boolean {
  if (props.year !== current_year) return props.year > current_year
  if (props.month !== current_month) return props.month > current_month
  return day >= today
}

function day_cell_class(day: number): Record<string, boolean> {
  const isFuture = is_future_day(day)
  const entry = entry_for_day(day)

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

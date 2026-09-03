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
import { leaveTypeHalf, isExcludedLeaveType } from "@/leaveTypes"
import { useYear } from "@/composables/useYear"

const props = defineProps<{
  entries: Entry[]
  month: number
}>()

const { year } = useYear()
const current_month = new Date().getMonth() + 1
const current_year = new Date().getFullYear()
const today = new Date().getDate()

const days_in_month = computed(() =>
  new Date(year.value, props.month, 0).getDate()
)

const first_day_offset = computed(() => {
  const day = new Date(year.value, props.month - 1, 1).getDay()
  return (day + 6) % 7 // Monday-start: Sun=6, Mon=0, ..., Sat=5
})

function entry_for_day(day: number): Entry | undefined {
  return props.entries.find((e) => new Date(e.date).getDate() === day)
}

function is_future_day(day: number): boolean {
  if (year.value !== current_year) return year.value > current_year
  if (props.month !== current_month) return props.month > current_month
  return day >= today
}

function day_cell_class(day: number): Record<string, boolean> {
  const isFuture = is_future_day(day)
  const entry = entry_for_day(day)

  if (!entry) return { "future-day": isFuture }

  const half = leaveTypeHalf(entry.type)
  const isAm = (entry.am && !entry.pm) || half === "am"
  const isPm = (entry.pm && !entry.am) || half === "pm"

  return {
    "has-entry": true,
    "am-half": isAm,
    "pm-half": isPm,
    "future-day": isFuture,
    "refresh-entry": !!entry.refresh,
    "excluded-entry": isExcludedLeaveType(entry.type),
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
  --entry-bg: rgb(var(--v-theme-primary));
  background-color: var(--entry-bg);
  cursor: pointer;
  text-decoration: none;
}

.day-cell.has-entry.excluded-entry {
  --entry-bg: rgba(128, 128, 128, 0.7);
}

.day-cell.has-entry.am-half {
  background: linear-gradient(
    to bottom right,
    var(--entry-bg) 50%,
    var(--empty-bg) 50%
  );
}

.day-cell.has-entry.pm-half {
  background: linear-gradient(
    to bottom right,
    var(--empty-bg) 50%,
    var(--entry-bg) 50%
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

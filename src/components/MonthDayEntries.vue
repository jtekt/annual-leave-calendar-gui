<template>
  <div class="entries_container">
    <router-link
      class="entry"
      :class="{
        taken: passed_date(entry),
        refresh: entry.refresh,
        excluded: isExcludedLeaveType(entry.type),
      }"
      v-for="entry in entries"
      :key="entry._id"
      :to="{ name: 'entry', params: { id: entry._id } }"
    >
      {{ day_of_entry(entry) }}
      <span
        class="half_indicator"
        v-if="(entry.am && !entry.pm) || leaveTypeHalf(entry.type) === 'am'"
        >am</span
      >
      <span
        class="half_indicator"
        v-if="(entry.pm && !entry.am) || leaveTypeHalf(entry.type) === 'pm'"
        >pm</span
      >
    </router-link>
  </div>
</template>

<script setup lang="ts">
import type { Entry } from "@/types"
import { leaveTypeHalf, isExcludedLeaveType } from "@/leaveTypes"

const props = defineProps<{
  month: number
  entries: Entry[]
}>()

function day_of_entry(entry: Entry): number {
  return new Date(entry.date).getDate()
}

function passed_date(entry: Entry): boolean {
  return new Date(entry.date) < new Date()
}
</script>

<style scoped>
.entries_container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.entry {
  text-decoration: none;
  font-weight: bold;
  display: inline-flex;
  align-items: flex-start;
  border: 1px solid transparent;
  border-radius: 0.25em;
  padding-inline: 0.25em;
  color: rgb(var(--v-theme-primary));
}

.entry:not(.taken) {
  color: rgb(var(--v-theme-secondary));
}

.entry.excluded,
.entry.excluded:not(.taken) {
  color: rgba(var(--v-theme-on-surface), 0.5);
}

.month_header {
  text-align: left;
  /* color: #aaaaaa; */
  opacity: 0.5;
  font-size: 80%;
}

.entry.refresh {
  border: 2px solid rgb(14, 205, 122);
}

.half_indicator {
  font-size: 75%;
  margin-left: 0.25em;
}
</style>

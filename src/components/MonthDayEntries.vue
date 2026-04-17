<template>
  <div class="entries_container">
    <router-link
      class="entry"
      :class="{ taken: passed_date(entry), refresh: entry.refresh }"
      v-for="entry in entries"
      :key="entry._id"
      :to="{ name: 'entry', params: { id: entry._id } }"
    >
      {{ day_of_entry(entry) }}
      <span
        class="half_indicator"
        v-if="(entry.am && !entry.pm) || entry.type === '前半休'"
        >am</span
      >
      <span
        class="half_indicator"
        v-if="(entry.pm && !entry.am) || entry.type === '後半休'"
        >pm</span
      >
    </router-link>
  </div>
</template>

<script setup lang="ts">
import type { Entry } from "@/types"

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
.month {
  min-height: 3em;
  padding: 0.25em;
  text-align: center;
}

.month.ellapsed {
  background-color: #aaaaaa33;
}
.month.current {
  border-width: 2px;
}

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
  color: inherit;
}

.entry:not(.taken) {
  opacity: 50%;
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

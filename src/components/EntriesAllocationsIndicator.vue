<template>
  <v-tooltip location="bottom" theme="dark">
    <template v-slot:activator="{ props }">
      <div class="wrapper" v-bind="props">
        <div v-if="total_allocations" class="allocations">
          <div v-if="allocations.carried_over" class="carried_over">
            <span>{{ allocations.carried_over }}</span>
          </div>
          <div
            v-if="allocations.current_year_grants"
            class="current_year_grants"
          >
            <span>{{ allocations.current_year_grants }}</span>
          </div>
        </div>
        <div class="leaves">
          <div class="taken" v-if="taken">
            <span v-if="taken_percent > 10">{{ taken }}</span>
          </div>
          <div class="future" v-if="future">
            <span v-if="future_percent > 10">{{ future }}</span>
          </div>
          <div class="missing" v-if="!reserve && missing_percent > 0"></div>
        </div>
      </div>
    </template>
    <!-- Tooltip content -->
    <div class="tooltip">
      <div>
        <div class="text-h6">{{ t("Leaves") }}: {{ total_entries }}</div>
        <div style="color: rgb(var(--v-theme-primary))">
          {{ t("Days taken this year") }}: {{ taken }}
        </div>
        <div style="color: rgb(var(--v-theme-secondary))">
          {{ t("Days planned this year") }}: {{ future }}
        </div>
      </div>
      <div v-if="total_allocations">
        <div class="text-h6">
          {{ t("Allocations") }}: {{ total_allocations }}
        </div>
        <div
          v-if="allocations.carried_over"
          style="color: rgb(var(--v-theme-allocations-carried-over))"
        >
          {{ t("Carried over days") }}: {{ allocations.carried_over }}
        </div>
        <div
          v-if="allocations.current_year_grants"
          style="color: rgb(var(--v-theme-allocations-current-year))"
        >
          {{ t("Current year grants days") }}:
          {{ allocations.current_year_grants }}
        </div>
      </div>
      <div class="legend_target" v-if="target && !reserve">
        <div class="text-h6">{{ t("Leave target") }}: {{ target }}</div>
        <template v-if="min && allocations?.target">
          <div v-if="min">{{ t("Absolute minimum leaves") }}: {{ min }}</div>
          <div v-if="allocations?.target">
            {{ t("User defined leave target") }}: {{ allocations?.target }}
          </div>
        </template>
      </div>
    </div>
  </v-tooltip>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import type { Entry, AllocationData } from "@/types"

const { VITE_MINIMUM_LEAVES = "0" } = import.meta.env

const props = defineProps<{
  entries: Entry[]
  allocations?: AllocationData
  reserve?: boolean
}>()

const { t } = useI18n()

const min = Number(VITE_MINIMUM_LEAVES)

const target = computed(() => Math.max(min, props.allocations?.target || 0, 0))

const total_allocations = computed(() => {
  if (!props.allocations) return 0
  const { current_year_grants = 0, carried_over = 0 } = props.allocations
  return current_year_grants + carried_over
})

const future = computed(() =>
  props.entries.reduce((total, { type, date }) => {
    if (new Date(date) > new Date()) {
      if (["前半休", "後半休"].includes(type)) return total + 0.5
      else return total + 1
    }
    return total
  }, 0)
)

const taken = computed(() =>
  props.entries.reduce((total, { type, date }) => {
    if (new Date(date) < new Date()) {
      if (["前半休", "後半休"].includes(type)) return total + 0.5
      else return total + 1
    }
    return total
  }, 0)
)

const max = computed(() => {
  if (props.reserve)
    return Math.max(1, total_allocations.value, total_entries.value)
  else
    return Math.max(
      1,
      target.value,
      total_allocations.value,
      total_entries.value
    )
})

const total_entries = computed(() => taken.value + future.value)

const carried_over_percent = computed(
  () => (100 * props.allocations?.carried_over || 0) / max.value
)
const current_year_grants_percent = computed(
  () => (100 * props.allocations?.current_year_grants || 0) / max.value
)

const entries_percent = computed(() => (100 * total_entries.value) / max.value)
const taken_percent = computed(() => (100 * taken.value) / max.value)
const future_percent = computed(() => (100 * future.value) / max.value)
const missing_percent = computed(
  () => (100 * (target.value - total_entries.value)) / max.value
)
</script>

<style scoped>
.wrapper {
  height: 1.5em;
  position: relative;

  font-size: 80%;
  margin-bottom: 1em;
}

.allocations {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  font-size: 80%;
}

.allocations > div {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 5px;
  border-style: solid;
  border-width: 1.5px;
}

.allocations span {
  position: absolute;
  bottom: -1.5em;
  left: 50%;
  transform: translateX(-50%);
}

.carried_over {
  left: 0;
  width: v-bind(`${carried_over_percent}%`);

  border-color: rgb(var(--v-theme-allocations-carried-over));
  color: rgb(var(--v-theme-allocations-carried-over));
  background-color: rgba(var(--v-theme-allocations-carried-over), 0.1);
}

.current_year_grants {
  border-color: rgb(var(--v-theme-allocations-current-year));
  color: rgb(var(--v-theme-allocations-current-year));
  background-color: rgba(var(--v-theme-allocations-current-year), 0.1);
  left: v-bind(`${carried_over_percent}%`);
  width: v-bind(`${current_year_grants_percent}%`);
}

.wrapper > div > div:not(:last-child) {
  border-right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.wrapper > div > div:not(:first-child) {
  border-left: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.leaves {
  position: absolute;
  top: 4px;
  left: 4px;
  bottom: 4px;
  right: 4px;
  /* color: #fff; */
}

.leaves > div {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.taken {
  left: 0;
  width: v-bind(`${taken_percent}%`);
  background-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-primary));
}

.future {
  left: v-bind(`${taken_percent}%`);
  width: v-bind(`${future_percent}%`);
  background-color: rgb(var(--v-theme-secondary));
  color: rgb(var(--v-theme-secondary));
}

.missing {
  left: v-bind(`${taken_percent + future_percent}%`);
  width: v-bind(`${missing_percent}%`);
  border: 1.5px dashed #c00000;
  background-color: #c0000011;
}

.leaves span {
  position: absolute;
  top: -1.7em;
  left: 50%;
  transform: translateX(-50%);
}

.tooltip {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.legend_target {
  border: 2px dashed #c00000;
  background-color: #c0000011;
  border-radius: 0.25em;
  padding: 0.25em;
}
</style>

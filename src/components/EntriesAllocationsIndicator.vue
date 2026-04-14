<template>
  <div class="total">
    <template v-if="allocations">
      <v-tooltip location="top" v-if="allocations.carried_over">
        <template #activator="{ props: tooltipProps }">
          <div v-bind="tooltipProps" class="carriedOver allocation bar">
            {{ allocations.carried_over }}
          </div>
        </template>
        <span>
          {{ t("Carried over days") }}: {{ allocations.carried_over }}
        </span>
      </v-tooltip>

      <v-tooltip location="top" v-if="allocations.current_year_grants">
        <template #activator="{ props: tooltipProps }">
          <div v-bind="tooltipProps" class="currentYear allocation bar">
            {{ allocations.current_year_grants }}
          </div>
        </template>
        <span>
          {{ t("Current year grants days") }}:
          {{ allocations.current_year_grants }}
        </span>
      </v-tooltip>
    </template>

    <!-- If below minimum -->
    <v-tooltip v-if="!reserve && min" location="bottom">
      <template #activator="{ props: tooltipProps }">
        <div v-bind="tooltipProps" class="min leaves bar" />
      </template>
      <span>{{
        t("Must take this year", { n: min - total_taken - total_future })
      }}</span>
    </v-tooltip>

    <template v-if="total_taken + total_future">
      <v-tooltip location="bottom" v-if="total_taken">
        <template #activator="{ props: tooltipProps }">
          <div v-bind="tooltipProps" class="taken leaves bar">
            {{ takenPercent > 10 ? total_taken : "" }}
          </div>
        </template>
        <span>{{ t("Days taken this year") }}: {{ total_taken }}</span>
      </v-tooltip>

      <v-tooltip location="bottom" v-if="total_future">
        <template #activator="{ props: tooltipProps }">
          <div v-bind="tooltipProps" class="future leaves bar">
            {{ futurePercent > 10 ? total_future : "" }}
          </div>
        </template>
        <span> {{ t("Days planned this year") }}: {{ total_future }} </span>
      </v-tooltip>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { colors } from "@/config"
import type { Entry, AllocationData } from "@/types"

const { VITE_MINIMUM_LEAVES = "0" } = import.meta.env

const min = Number(VITE_MINIMUM_LEAVES)

const props = defineProps<{
  entries: Entry[]
  allocations?: AllocationData
  reserve?: boolean
}>()

const { t } = useI18n()

const allocationsExist = computed(
  () =>
    props.allocations?.current_year_grants || props.allocations?.carried_over
)

const total_allocations = computed(() => {
  if (!allocationsExist.value) return 0
  return props.allocations.current_year_grants + props.allocations.carried_over
})

const total_future = computed(() =>
  props.entries.reduce((total, { type, date }) => {
    if (new Date(date) > new Date()) {
      if (type === "有休") return total + 1
      if (type === "前半休" || type === "後半休") return total + 0.5
    }
    return total
  }, 0)
)

const total_taken = computed(() =>
  props.entries.reduce((total, { type, date }) => {
    if (new Date(date) < new Date()) {
      if (type === "有休") return total + 1
      if (type === "前半休" || type === "後半休") return total + 0.5
    }
    return total
  }, 0)
)

const total_taken_and_future = computed(
  () => total_taken.value + total_future.value
)

const carriedOverPercent = computed(() => {
  if (!props.allocations || !total_allocations.value) return 0
  return (props.allocations.carried_over / total_allocations.value) * 100
})

const takenPercent = computed(() => {
  let denominator = 1
  if (total_allocations.value) denominator = total_allocations.value
  else if (props.reserve) denominator = total_taken_and_future.value
  else denominator = Math.max(total_taken_and_future.value, min)

  return (total_taken.value / denominator) * 100
})

const futurePercent = computed(() => {
  let denominator = 1
  if (total_allocations.value) denominator = total_allocations.value
  else if (props.reserve) denominator = total_taken_and_future.value
  else denominator = Math.max(total_taken_and_future.value, min)

  return (total_future.value / denominator) * 100
})

const minPercent = computed(() => {
  if (total_allocations.value) return (min / total_allocations.value) * 100
  else if (total_taken_and_future.value < min) return 100
  else return 0
})
</script>

<style scoped>
.total {
  position: relative;
  height: 3em;
  text-align: center;
  font-size: 80%;
}

.allocation {
  position: absolute;
  top: 0;
  /* bottom: 55%; */
  bottom: 0;
  overflow: hidden;
  font-size: 80%;
  color: black;
}

.allocation.carriedOver {
  left: 0;
  width: v-bind(`${carriedOverPercent}%`);
  background-color: v-bind("colors.allocations.carried_over");
  /* border-bottom: 5px solid v-bind("colors.allocations.carried_over"); */
}

.allocation.currentYear {
  right: 0;
  width: v-bind(`${100 - carriedOverPercent}%`);
  background-color: v-bind("colors.allocations.current_year_grants");
  /* border-bottom: 5px solid v-bind("colors.allocations.current_year_grants"); */
}

.leaves {
  position: absolute;
  top: 40%;
  bottom: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.taken {
  left: 0;
  width: v-bind(`${takenPercent}%`);
  background-color: v-bind("colors.leaves.taken");
  /* border-top: 8px solid v-bind("colors.leaves.taken"); */
}

.future {
  width: v-bind(`${futurePercent}%`);
  left: v-bind(`${takenPercent}%`);
  background-color: v-bind("colors.leaves.future");
  /* border-top: 8px solid v-bind("colors.leaves.future"); */
}

.min {
  border-radius: 0.25em;
  width: v-bind(`${minPercent}%`);
  border: 1.75px dashed #ff0000aa;
  /* boder-top: 8px dashed #ff0000aa; */
}

/* This gets messy */
.taken,
.bar:first-child {
  border-top-left-radius: 0.25em;
  border-bottom-left-radius: 0.25em;
}

.currentYear,
.bar:last-child {
  border-top-right-radius: 0.25em;
  border-bottom-right-radius: 0.25em;
}
</style>

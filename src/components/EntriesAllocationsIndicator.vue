<template>
  <div class="total">
    <template v-if="allocations">
      <v-tooltip location="top" v-if="allocations.carried_over">
        <template #activator="{ props: tooltipProps }">
          <div
            v-bind="tooltipProps"
            class="carriedOver allocation bar"
            :style="{ width: `${carriedOverPercent}%` }"
          >
            {{ allocations.carried_over }}
          </div>
        </template>
        <span
          >{{ t("Carried over days") }}: {{ allocations.carried_over }}</span
        >
      </v-tooltip>

      <v-tooltip location="top" v-if="allocations.current_year_grants">
        <template #activator="{ props: tooltipProps }">
          <div
            v-bind="tooltipProps"
            class="currentYear allocation bar"
            :style="{ width: `${100 - carriedOverPercent}%` }"
          >
            {{ allocations.current_year_grants }}
          </div>
        </template>
        <span
          >{{ t("Current year grants days") }}:
          {{ allocations.current_year_grants }}</span
        >
      </v-tooltip>
    </template>

    <!-- If below minimum -->
    <v-tooltip v-if="!reserve && min" location="bottom">
      <template #activator="{ props: tooltipProps }">
        <div
          v-bind="tooltipProps"
          class="min leaves bar"
          :style="{ width: `${minPercent}%` }"
        />
      </template>
      <span>{{
        t("Must take this year", { n: min - total_taken - total_yotei })
      }}</span>
    </v-tooltip>

    <template v-if="total_taken + total_yotei">
      <v-tooltip location="bottom" v-if="total_taken">
        <template #activator="{ props: tooltipProps }">
          <div
            v-bind="tooltipProps"
            class="taken leaves bar"
            :style="{
              width: `${takenPercent}%`,
              backgroundColor: colors.leaves.taken,
            }"
          >
            {{ takenPercent > 10 ? total_taken : "" }}
          </div>
        </template>
        <span>{{ t("Days taken this year") }}: {{ total_taken }}</span>
      </v-tooltip>

      <v-tooltip location="bottom" v-if="total_yotei">
        <template #activator="{ props: tooltipProps }">
          <div
            v-bind="tooltipProps"
            class="yotei leaves bar"
            :style="{
              width: `${yoteiPercent}%`,
              left: `${takenPercent}%`,
              backgroundColor: colors.leaves.yotei,
            }"
          >
            {{ yoteiPercent > 10 ? total_yotei : "" }}
          </div>
        </template>
        <span> {{ t("Days planned this year") }}: {{ total_yotei }} </span>
      </v-tooltip>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { colors } from "@/config"
import type { Entry, AllocationData } from "@/types"
import { useTheme } from "vuetify"

const theme = useTheme()

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

const total_yotei = computed(() =>
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

const total_taken_and_yotei = computed(
  () => total_taken.value + total_yotei.value
)

const carriedOverPercent = computed(() => {
  if (!props.allocations || !total_allocations.value) return 0
  return (props.allocations.carried_over / total_allocations.value) * 100
})

const takenPercent = computed(() => {
  let denominator = 1
  if (total_allocations.value) denominator = total_allocations.value
  else if (props.reserve) denominator = total_taken_and_yotei.value
  else denominator = Math.max(total_taken_and_yotei.value, min)

  return (total_taken.value / denominator) * 100
})

const yoteiPercent = computed(() => {
  let denominator = 1
  if (total_allocations.value) denominator = total_allocations.value
  else if (props.reserve) denominator = total_taken_and_yotei.value
  else denominator = Math.max(total_taken_and_yotei.value, min)

  return (total_yotei.value / denominator) * 100
})

const minPercent = computed(() => {
  if (total_allocations.value) return (min / total_allocations.value) * 100
  else if (total_taken_and_yotei.value < min) return 100
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
  bottom: 0;
  overflow: hidden;
  font-size: 80%;
}

.carriedOver {
  left: 0;
  background-color: v-bind("colors.allocations.carried_over");
}

.currentYear {
  right: 0;
  background-color: v-bind("colors.allocations.current_year_grants");
}

.leaves {
  position: absolute;
  top: 40%;
  bottom: 0;
  overflow: hidden;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.taken {
  left: 0;
}

.taken:last-child {
  border-radius: 0.25em;
}

.yotei {
  position: absolute;
}

.min {
  background-color: #ff000022;
  border: 1.5px dashed #ff0000aa;
  border-radius: 0.25em;
}

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

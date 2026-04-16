<template>
  <div class="wrapper">
    <div class="allocations" v-if="total_allocations">
      <div class="carried_over"></div>
      <div class="current_year_grants"></div>
    </div>
    <div class="leaves">
      <div class="taken" v-if="taken"></div>
      <div class="future" v-if="future"></div>
      <div class="missing" v-if="missing_ratio > 0"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"

const min = ref(27)

const current_year_grants = ref(14)
const carried_over = ref(1)

const taken = ref(3)
const future = ref(4)

const total_allocations = computed(
  () => current_year_grants.value + carried_over.value
)
const total_entries = computed(() => taken.value + future.value)

const max = computed(() =>
  Math.max(1, total_allocations.value, total_entries.value, min.value)
)

// const allocations_ratio = (100 * total_allocations) / max
const carried_over_ratio = computed(
  () => (100 * carried_over.value) / max.value
)
const current_year_grants_ratio = computed(
  () => (100 * current_year_grants.value) / max.value
)

const entries_ratio = computed(() => (100 * total_entries.value) / max.value)
const taken_ratio = computed(() => (100 * taken.value) / max.value)
const future_ratio = computed(() => (100 * future.value) / max.value)
const missing_ratio = computed(
  () => (100 * (min.value - total_entries.value)) / max.value
)
</script>

<style scoped>
.wrapper {
  height: 50px;
  position: relative;

  margin: 2rem;
}

.allocations {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.allocations > div {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 5px;
}

.carried_over {
  border: 3px solid #006aff;
  left: 0;
  width: v-bind(`${carried_over_ratio}%`);
}

.current_year_grants {
  border: 3px solid #39b93c;
  left: v-bind(`${carried_over_ratio}%`);
  width: v-bind(`${current_year_grants_ratio}%`);
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
  top: 5px;
  left: 5px;
  bottom: 5px;
  right: 5px;
}

.leaves > div {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 5px;
}

.taken {
  left: 0;
  width: v-bind(`${taken_ratio}%`);
  background-color: #444444;
}

.future {
  left: v-bind(`${taken_ratio}%`);
  width: v-bind(`${future_ratio}%`);
  background-color: #a0a0a0;
}

.missing {
  left: v-bind(`${taken_ratio + future_ratio}%`);
  width: v-bind(`${missing_ratio}%`);
  border: 3px dashed #c00000;
}
</style>

<template>
  <div>
    <v-row align="center" dense justify="space-around">
      <v-col cols="auto"> 年休 </v-col>
      <v-col cols="auto"> 積休 </v-col>
    </v-row>
    <v-row dense align="center">
      <v-col>
        <EntriesAllocationsIndicator
          :entries="leaves"
          :allocations="allocations?.leaves"
        />
      </v-col>
      <v-col>
        <EntriesAllocationsIndicator
          :reserve="true"
          :entries="reserve"
          :allocations="allocations?.reserve"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import EntriesAllocationsIndicator from "@/components/EntriesAllocationsIndicator.vue"
import type { Entry, Allocations } from "@/types"

const props = defineProps<{
  entries: Entry[]
  allocations?: Allocations | null
}>()

const leaves = computed(() => props.entries.filter((e) => !e.reserve))
const reserve = computed(() => props.entries.filter((e) => e.reserve))
</script>

<style scoped>
.totalBar {
  display: flex;
  position: relative;
  height: 3em;
  color: white;
}
</style>

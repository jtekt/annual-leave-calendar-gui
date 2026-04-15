<template>
  <v-card variant="outlined" class="px-2 py-1">
    <v-row dense align="center">
      <v-col>
        <div class="legend">{{ t("Leaves short") }}</div>
        <EntriesAllocationsIndicator
          :entries="leaves"
          :allocations="allocations?.leaves"
        />
      </v-col>
      <v-col>
        <div class="legend">{{ t("Reserve short") }}</div>
        <EntriesAllocationsIndicator
          :reserve="true"
          :entries="reserve"
          :allocations="allocations?.reserve"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import EntriesAllocationsIndicator from "@/components/EntriesAllocationsIndicator.vue"
import type { Entry, Allocations } from "@/types"

const props = defineProps<{
  entries: Entry[]
  allocations?: Allocations | null
}>()

const { t } = useI18n()
const leaves = computed(() => props.entries.filter((e) => !e.reserve))
const reserve = computed(() => props.entries.filter((e) => e.reserve))
</script>

<style scoped>
.total_indicator {
  border: 1px solid #ddd;
  border-radius: 0.5em;
  padding: 0.25em 0.5em;
}
.totalBar {
  display: flex;
  position: relative;
  height: 3em;
  color: white;
}
.legend {
  font-size: 80%;
  opacity: 80%;
  text-align: center;
  margin-bottom: 0.25em;
}
</style>

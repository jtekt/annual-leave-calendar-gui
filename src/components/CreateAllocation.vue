<template>
  <v-form @submit.prevent="submit">
    <v-card elevation="0" class="pa-4">
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field
              :label="t('Leaves')"
              type="number"
              min="0"
              step="0.5"
              v-model.number="leaves.carried_over"
              :hint="t('Carried over')"
              persistent-hint
            />
          </v-col>

          <v-col>
            <v-text-field
              :label="t('Leaves')"
              type="number"
              min="0"
              step="0.5"
              v-model.number="leaves.current_year_grants"
              :hint="t('Current year grants')"
              persistent-hint
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field
              :label="t('Reserve')"
              type="number"
              min="0"
              step="0.5"
              v-model.number="reserve.carried_over"
              :hint="t('Carried over')"
              persistent-hint
            />
          </v-col>

          <v-col>
            <v-text-field
              :label="t('Reserve')"
              type="number"
              min="0"
              step="0.5"
              v-model.number="reserve.current_year_grants"
              :hint="t('Current year grants')"
              persistent-hint
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="mt-6">
        <v-spacer />
        <v-btn variant="flat" color="primary" type="submit">
          {{ t("Create allocation") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { watch, ref } from "vue"
import { useI18n } from "vue-i18n"
import axios from "axios"
import type { AllocationData, Allocations } from "@/types"

const props = defineProps<{
  user_id: string
  year: number
  exist?: Allocations | null
}>()

const emit = defineEmits<{
  (e: "createAllocation"): void
}>()

const { t } = useI18n()
const loading = ref(false)

const leaves = ref<AllocationData>({ carried_over: 0, current_year_grants: 0 })
const reserve = ref<AllocationData>({ carried_over: 0, current_year_grants: 0 })

watch(
  () => props.exist,
  (val) => {
    if (val) {
      leaves.value = { ...val.leaves }
      reserve.value = { ...val.reserve }
    } else {
      leaves.value = { carried_over: 0, current_year_grants: 0 }
      reserve.value = { carried_over: 0, current_year_grants: 0 }
    }
  },
  { immediate: true }
)

function submit() {
  loading.value = true
  const body = {
    year: props.year,
    leaves: { ...leaves.value },
    reserve: { ...reserve.value },
  }
  axios
    .post(`/v1/users/${props.user_id}/allocations`, body)
    .then(() => emit("createAllocation"))
    .catch((error) => {
      console.error(error)
      alert(t("Error while creating allocation"))
    })
}
</script>

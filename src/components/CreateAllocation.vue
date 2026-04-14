<template>
  <v-dialog v-model="dialog" max-width="30rem">
    <template v-slot:activator="{ props: dialogProps }">
      <v-btn v-bind="dialogProps" prepend-icon="mdi-plus">
        {{ t("Register allocations") }}
      </v-btn>
    </template>
    <v-form @submit.prevent="submit">
      <v-card>
        <v-card-title>{{ t("Create allocation") }}</v-card-title>
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
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" color="primary" type="submit">
            {{ t("Create allocation") }}
          </v-btn>
          <v-btn variant="text" @click="dialog = false">{{
            t("Cancel")
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import axios from "axios"
import type { AllocationData } from "@/types"

const props = defineProps<{
  user_id: string
  year: number
}>()

const emit = defineEmits<{
  (e: "createAllocation"): void
}>()

const { t } = useI18n()
const dialog = ref(false)
const loading = ref(false)

const leaves = ref<AllocationData>({ carried_over: 0, current_year_grants: 0 })
const reserve = ref<AllocationData>({ carried_over: 0, current_year_grants: 0 })

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
    .finally(() => {
      loading.value = false
      leaves.value = { carried_over: 0, current_year_grants: 0 }
      reserve.value = { carried_over: 0, current_year_grants: 0 }
      dialog.value = false
    })
}
</script>

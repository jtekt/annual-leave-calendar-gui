<template>
  <v-row>
    <v-col>
      <v-card prepend-icon="mdi-calendar">
        <template #title>
          {{ t("Register allocations") }}
        </template>
        <template #append>
          <YearSelector />
        </template>
      </v-card>
    </v-col>
  </v-row>
  <v-row justify="center" v-if="!ready">
    <v-col cols="auto">
      <v-progress-circular indeterminate />
    </v-col>
  </v-row>
  <v-form v-else ref="form" @submit.prevent="submit">
    <v-row>
      <v-col>
        <v-card :title="t('Leaves')" height="100%">
          <v-card-text>
            <v-row>
              <v-col>
                <div class="field-carried">
                  <v-text-field
                    :label="t('Carried over')"
                    v-model.number="leaves.carried_over"
                    type="number"
                    min="0"
                    step="0.5"
                    variant="plain"
                    hide-details
                  />
                </div>
              </v-col>

              <v-col>
                <div class="field-current">
                  <v-text-field
                    :label="t('Current year grants')"
                    v-model.number="leaves.current_year_grants"
                    type="number"
                    min="0"
                    step="0.5"
                    variant="plain"
                    hide-details
                  />
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field
                  :label="`${t('Leave target')} (${t('Absolute minimum leaves')}: ${VITE_MINIMUM_LEAVES})`"
                  v-model.number="leaves.target"
                  type="number"
                  :min="VITE_MINIMUM_LEAVES"
                  step="0.5"
                  density="compact"
                  :rules="[
                    (v) =>
                      (!v && v !== 0) ||
                      Number(VITE_MINIMUM_LEAVES) <= v ||
                      t('Must be minimum days or more', {
                        min_days: VITE_MINIMUM_LEAVES,
                      }),
                  ]"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card :title="t('Reserve')" height="100%">
          <v-card-text>
            <v-row>
              <v-col>
                <div class="field-carried">
                  <v-text-field
                    :label="t('Carried over')"
                    v-model.number="reserve.carried_over"
                    type="number"
                    min="0"
                    step="0.5"
                    variant="plain"
                    hide-details
                  />
                </div>
              </v-col>

              <v-col>
                <div class="field-current">
                  <v-text-field
                    :label="t('Current year grants')"
                    v-model.number="reserve.current_year_grants"
                    type="number"
                    min="0"
                    step="0.5"
                    variant="plain"
                    hide-details
                  />
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="auto">
        <v-btn color="primary" type="submit" :loading="loading">
          {{ t("Register") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
  <v-snackbar v-model="snackbar.show" :color="snackbar.color">
    {{ snackbar.message }}
  </v-snackbar>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import axios from "axios"
import type { AllocationData, Allocations } from "@/types"
import { useYear } from "@/composables/useYear"
import YearSelector from "@/components/YearSelector.vue"
import cleanDeep from "clean-deep"

const { VITE_MINIMUM_LEAVES = "0" } = import.meta.env

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { year } = useYear()
const loading = ref(false)
const ready = ref(false)
const form = ref()
const snackbar = ref({
  show: false,
  message: "",
  color: "red",
})

const user_id = computed(() => String(route.params.id))

const leaves = ref<AllocationData | null>(null)
const reserve = ref<AllocationData | null>(null)

async function get_allocations() {
  try {
    ready.value = false

    const { data } = await axios.get<Array<Allocations>>(
      `/v1/users/${user_id.value}/allocations`,
      { params: { year: year.value } }
    )

    if (data.length) {
      leaves.value = { ...data[0].leaves }
      reserve.value = { ...data[0].reserve }
    } else {
      leaves.value = {
        carried_over: 0,
        current_year_grants: 0,
      }
      reserve.value = {
        carried_over: 0,
        current_year_grants: 0,
      }
    }
  } catch (error) {
    console.error(error)
    snackbar.value = {
      show: true,
      message: t("Error while getting allocation"),
      color: "red",
    }
  } finally {
    ready.value = true
  }
}

watch(year, get_allocations)
onMounted(get_allocations)

async function submit() {
  const { valid } = await form.value.validate()
  if (!valid) return

  try {
    loading.value = true
    await axios.post(`/v1/users/${user_id.value}/allocations`, {
      year: year.value,
      leaves: cleanDeep(leaves.value),
      reserve: reserve.value,
    })
    router.push({
      name: "user_entries",
      params: { id: user_id.value },
      query: { year: year.value },
    })
  } catch (error) {
    console.error(error)
    snackbar.value = {
      show: true,
      message: t("Error while registering allocation"),
      color: "red",
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.field-carried {
  border: 2px solid rgb(var(--v-theme-allocations-carried-over));
  background-color: rgba(var(--v-theme-allocations-carried-over), 0.08);
  border-radius: 8px;
  padding: 6px 8px;
}

.field-current {
  border: 2px solid rgb(var(--v-theme-allocations-current-year));
  background-color: rgba(var(--v-theme-allocations-current-year), 0.08);
  border-radius: 8px;
  padding: 6px 8px;
}

.field-carried :deep(.v-label) {
  color: rgb(var(--v-theme-allocations-carried-over));
  font-weight: 550;
}

.field-current :deep(.v-label) {
  color: rgb(var(--v-theme-allocations-current-year));
  font-weight: 550;
}
</style>

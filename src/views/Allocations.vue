<template>
  <v-card max-width="30rem" class="mx-auto" prepend-icon="mdi-calendar">
    <template #title>
      {{ t("Register allocations") }}
    </template>
    <template #append>
      <v-select
        :items="yearItems"
        v-model="year"
        :label="t('Year')"
        hide-details
        variant="outlined"
        density="compact"
        max-width="150px"
        class="mr-2"
      />
    </template>
    <v-card-text v-if="!ready" class="text-center py-6">
      <v-progress-circular indeterminate />
    </v-card-text>
    <v-form v-else-if="leaves && reserve" @submit.prevent="submit">
      <v-card-text>
        <div class="text-subtitle-1 font-weight-medium mb-4">
          {{ t("Leaves") }}
        </div>
        <v-row>
          <v-col>
            <v-text-field
              :label="t('Carried over')"
              v-model.number="leaves.carried_over"
              type="number"
              min="0"
              step="0.5"
              variant="outlined"
              hide-details
            />
          </v-col>
          <v-col>
            <v-text-field
              :label="t('Current year grants')"
              v-model.number="leaves.current_year_grants"
              type="number"
              min="0"
              step="0.5"
              variant="outlined"
              hide-details
            />
          </v-col>
        </v-row>
        <div class="text-subtitle-1 font-weight-medium mt-6 mb-4">
          {{ t("Reserve") }}
        </div>
        <v-row>
          <v-col>
            <v-text-field
              :label="t('Carried over')"
              v-model.number="reserve.carried_over"
              type="number"
              min="0"
              step="0.5"
              variant="outlined"
              hide-details
            />
          </v-col>
          <v-col>
            <v-text-field
              :label="t('Current year grants')"
              v-model.number="reserve.current_year_grants"
              type="number"
              min="0"
              step="0.5"
              variant="outlined"
              hide-details
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="flat" color="primary" type="submit" :loading="loading">
          {{ t("Register allocations") }}
        </v-btn>
      </v-card-actions>
    </v-form>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>
  </v-card>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import axios from "axios"
import type { AllocationData, Allocations } from "@/types"

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const ready = ref(false)
const snackbar = ref({
  show: false,
  message: "",
  color: "red",
})

const user_id = computed(() => String(route.params.id))
const yearItems = Array.from(
  { length: 10 },
  (_, i) => new Date().getFullYear() + i - 5
)
const year = computed({
  get: () => Number(route.query.year) || new Date().getFullYear(),
  set: (val) => router.replace({ query: { ...route.query, year: val } }),
})

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
  try {
    loading.value = true
    await axios.post(`/v1/users/${user_id.value}/allocations`, {
      year: year.value,
      leaves: leaves.value,
      reserve: reserve.value,
    })
    router.push({
      name: "user_entries",
      params: { id: user_id.value },
      query: { year: year.value },
    })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

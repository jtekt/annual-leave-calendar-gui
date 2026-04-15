<template>
  <v-card :loading="allocations_loading" prepend-icon="mdi-account">
    <template #title>{{ user?.display_name || user_id }}</template>
    <template #append>
      <v-select
        :items="yearItems"
        v-model="year"
        :label="t('Year')"
        hide-details
        variant="outlined"
        density="compact"
        class="mr-2"
      />
      <CreateAllocation
        :user_id="user_id"
        :year="year"
        :exist="allocations"
        @createAllocation="get_allocations"
      />
    </template>
    <v-divider />

    <v-card-text>
      <div v-if="allocations" class="mx-auto">
        <v-row class="text-subtitle-2 font-weight-bold pb-3">
          <v-col cols="4">
            {{ t("Type") }}
          </v-col>
          <v-col cols="4" class="text-center">
            {{ t("Carried over") }}
          </v-col>
          <v-col cols="4" class="text-center">
            {{ t("Current year grants") }}
          </v-col>
        </v-row>

        <v-divider />

        <v-row class="py-3 align-center">
          <v-col cols="4" class="font-weight-medium">
            {{ t("Leaves") }}
          </v-col>
          <v-col cols="4" class="text-center">
            {{ allocations.leaves.carried_over }}
          </v-col>
          <v-col cols="4" class="text-center">
            {{ allocations.leaves.current_year_grants }}
          </v-col>
        </v-row>

        <v-divider />

        <v-row class="py-3 align-center">
          <v-col cols="4" class="font-weight-medium">
            {{ t("Reserve") }}
          </v-col>
          <v-col cols="4" class="text-center">
            {{ allocations.reserve.carried_over }}
          </v-col>
          <v-col cols="4" class="text-center">
            {{ allocations.reserve.current_year_grants }}
          </v-col>
        </v-row>
      </div>
      <div v-else class="text-center py-8 text-medium-emphasis">
        {{ t("No Allocations") }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import axios from "axios"
import CreateAllocation from "@/components/CreateAllocation.vue"
import type { User, Allocations } from "@/types"

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const user_id = computed(() => String(route.params.id))
const yearItems = Array.from(
  { length: 10 },
  (_, i) => new Date().getFullYear() + i - 5
)
const year = computed({
  get: () => Number(route.query.year) || new Date().getFullYear(),
  set: (val) => router.replace({ query: { ...route.query, year: val } }),
})

const allocations_loading = ref(false)
const user = ref<User | null>(null)
const allocations = ref<Allocations | null>(null)

async function get_user() {
  try {
    const url = `${import.meta.env.VITE_USER_MANAGER_API_URL}/v3/employees/${user_id.value}`
    const { data } = await axios.get<User>(url)
    user.value = data
  } catch (error) {
    console.error(error)
  }
}

async function get_allocations() {
  allocations_loading.value = true
  try {
    const params = { year: year.value }

    const { data } = await axios.get<Array<Allocations>>(
      `/v1/users/${user_id.value}/allocations`,
      { params }
    )
    if (data.length > 0) {
      allocations.value = {
        leaves: data[0].leaves,
        reserve: data[0].reserve,
      }
    } else {
      allocations.value = null
    }
  } catch (error) {
    console.error(error)
  } finally {
    allocations_loading.value = false
  }
}

watch(user_id, (id) => {
  get_allocations()
  get_user()
})

watch(year, () => get_allocations())

onMounted(() => {
  get_allocations()
  get_user()
})
</script>

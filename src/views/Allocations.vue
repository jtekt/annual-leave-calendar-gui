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
      <v-table>
        <thead>
          <tr>
            <th>{{ t("Type") }}</th>
            <th>{{ t("Carried over") }}</th>
            <th>{{ t("Current year grants") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ t("Leaves") }}</td>
            <td>{{ allocations?.leaves?.carried_over }}</td>
            <td>{{ allocations?.leaves?.current_year_grants }}</td>
          </tr>
          <tr>
            <td>{{ t("Reserve") }}</td>
            <td>{{ allocations?.reserve?.carried_over }}</td>
            <td>{{ allocations?.reserve?.current_year_grants }}</td>
          </tr>
        </tbody>
      </v-table>
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

function get_user(id: string) {
  const url = `${import.meta.env.VITE_USER_MANAGER_API_URL}/v3/employees/${id}`
  axios
    .get<User>(url)
    .then(({ data }) => {
      user.value = data
    })
    .catch((error) => console.error(error))
}

function get_allocations() {
  allocations_loading.value = true
  const params = { year: year.value }
  axios
    .get<Array<Allocations>>(`/v1/users/${user_id.value}/allocations`, {
      params,
    })
    .then(({ data }) => {
      allocations.value = {
        leaves: data[0].leaves,
        reserve: data[0].reserve,
      }
    })
    .catch((error) => console.error(error))
    .finally(() => (allocations_loading.value = false))
}

watch(user_id, (id) => {
  get_allocations()
  get_user(id)
})

watch(year, () => get_allocations())

onMounted(() => {
  get_allocations()
  get_user(user_id.value)
})
</script>

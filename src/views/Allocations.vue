<template>
  <v-card :loading="allocations_loading">
    <template v-if="!allocations_loading">
      <v-container fluid>
        <v-row align="center">
          <v-col>
            <v-toolbar-title v-if="user">{{ user.display_name }}</v-toolbar-title>
            <v-toolbar-title v-else>{{ user_id }}</v-toolbar-title>
          </v-col>
          <v-spacer />
          <v-col>
            <v-select :items="yearItems" v-model="year" :label="t('Year')" />
          </v-col>
          <v-col cols="auto">
            <CreateAllocation
              :user_id="user_id"
              :year="year"
              @createAllocation="get_allocations"
            />
          </v-col>
        </v-row>
      </v-container>
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
    </template>
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
const year = ref(Number(route.query.year) || new Date().getFullYear())
const yearItems = Array.from(Array(10).keys()).map(
  (x) => new Date().getFullYear() + x - 5
)

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
    .get<Array<Allocations>>(`/v1/users/${user_id.value}/allocations`, { params })
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

watch(year, (newVal) => {
  router.replace({ query: { ...route.query, year: newVal } })
  get_allocations()
})

onMounted(() => {
  get_allocations()
  get_user(user_id.value)
})
</script>

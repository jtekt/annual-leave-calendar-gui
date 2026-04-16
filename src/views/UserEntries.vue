<template>
  <v-row justify="center" v-if="entries_loading">
    <v-col cols="auto">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-col>
  </v-row>

  <template v-else>
    <v-row>
      <v-col>
        <v-card :loading="user_loading" prepend-icon="mdi-account">
          <template #title>
            <v-card-title> {{ user?.display_name }} </v-card-title>
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
          <v-card-actions
            v-if="user && (current_user_id === user_id || user_id === 'self')"
          >
            <v-row>
              <v-col cols="auto">
                <v-btn
                  :to="{ name: 'new_entry' }"
                  prepend-icon="mdi-calendar-plus"
                  color="primary"
                >
                  {{ t("Create entry") }}
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  :to="{
                    name: 'user_allocations',
                    params: { id: user_id },
                    query: { year },
                  }"
                  prepend-icon="mdi-plus"
                >
                  {{ t("Register allocations") }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <UserCard
          :user="user"
          :entries="entries"
          :allocations="allocations"
          v-if="user"
        />
      </v-col>
    </v-row>
  </template>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import axios from "axios"
import { useIdUtils } from "@/composables/useIdUtils"

import type { User, Entry, Allocations } from "@/types"
import UserCard from "@/components/UserCard.vue"
import CreateAllocation from "@/components/CreateAllocation.vue"

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { current_user_id } = useIdUtils()

const user_id = computed(() => String(route.params.id))
const yearItems = Array.from(
  { length: 10 },
  (_, i) => new Date().getFullYear() + i - 5
)
const year = computed({
  get: () => Number(route.query.year) || new Date().getFullYear(),
  set: (val) => router.replace({ query: { ...route.query, year: val } }),
})

const entries = ref<Entry[]>([])
const entries_loading = ref(false)
const user = ref<User | null>(null)
const allocations = ref<Allocations | null>(null)
const user_loading = ref(false)
function get_entries() {
  entries_loading.value = true
  const params = { year: year.value }
  axios
    .get<{ entries: Entry[]; allocations: Allocations }>(
      `/v2/users/${user_id.value}/entries`,
      { params }
    )
    .then(({ data }) => {
      allocations.value = data.allocations
      entries.value = data.entries
    })
    .catch((error) => {
      alert(t("Failed to load data"))
      console.error(error)
    })
    .finally(() => {
      entries_loading.value = false
    })
}

async function get_user(id: string) {
  user_loading.value = true
  const url = `${import.meta.env.VITE_USER_MANAGER_API_URL}/v3/employees/${id}`
  try {
    const { data } = await axios.get<User>(url)
    user.value = data
  } catch (error) {
    console.error(error)
    alert("Failed to query user")
  } finally {
    user_loading.value = false
  }
}

watch(user_id, (id) => {
  get_entries()
  get_user(id)
})

watch(year, () => get_entries())

onMounted(() => {
  get_entries()
  get_user(user_id.value)
})
</script>

<template>
  <v-row justify="center" v-if="entries_loading">
    <v-col cols="auto">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-col>
  </v-row>

  <template v-else>
    <v-toolbar class="mb-6" elevation="3">
      <template v-if="current_user_id === user_id || user_id === 'self'">
        <v-btn :to="{ name: 'new_entry' }" prepend-icon="mdi-calendar-plus">
          {{ t("Create entry") }}
        </v-btn>
        <CreateAllocation :user_id="user?._id" :year="year" />
      </template>

      <v-spacer></v-spacer>

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
    </v-toolbar>

    <UserCard
      :user="user"
      :entries="entries"
      :allocations="allocations"
      v-if="user"
    />
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

function get_user(id: string) {
  const url = `${import.meta.env.VITE_USER_MANAGER_API_URL}/v3/employees/${id}`
  axios
    .get<User>(url)
    .then(({ data }) => {
      user.value = data
    })
    .catch((error) => console.error(error))
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

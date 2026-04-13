<template>
  <v-row justify="center" v-if="entries_loading">
    <v-col cols="auto">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-col>
  </v-row>
  <v-card v-else prepend-icon="mdi-account">
    <template v-slot:title> {{ user?.display_name || user_id }} </template>

    <template v-slot:append>
      <v-row align="center">
        <v-col>
          <v-toolbar-title>{{}}</v-toolbar-title>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-select
            :items="yearItems"
            v-model="year"
            :label="t('Year')"
            hide-details
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col
          cols="auto"
          v-if="current_user_id === user_id || user_id === 'self'"
        >
          <v-btn
            :to="{ name: 'new_entry' }"
            color="primary"
            prepend-icon="mdi-plus"
          >
            {{ t("Create entry") }}
          </v-btn>
        </v-col>
      </v-row>
    </template>

    <v-divider />

    <v-card-text>
      <p>
        <Total :entries="entries" :allocations="allocations" />
      </p>
      <Calendar :entries="entries" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import axios from "axios"
import { useIdUtils } from "@/composables/useIdUtils"
import Calendar from "@/components/Calendar.vue"
import Total from "@/components/Total.vue"
import type { User, Entry, Allocations } from "@/types"

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { current_user_id } = useIdUtils()

const user_id = computed(() => String(route.params.id))
const year = ref(Number(route.query.year) || new Date().getFullYear())
const yearItems = Array.from(Array(10).keys()).map(
  (x) => new Date().getFullYear() + x - 5
)

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

watch(year, (newVal) => {
  router.replace({ query: { ...route.query, year: newVal } })
  get_entries()
})

onMounted(() => {
  get_entries()
  get_user(user_id.value)
})
</script>

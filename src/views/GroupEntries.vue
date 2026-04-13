<template>
  <v-card prepend-icon="mdi-account-multiple">
    <template #title>
      {{ group ? `${group.properties.name} (${total}人)` : group_id }}
    </template>
    <template #append>
      <v-select
        :items="yearItems"
        v-model="year"
        label="Year"
        hide-details
        variant="outlined"
        density="compact"
      />
      <ExcelExportButton
        :total="total"
        :year="year"
        :group_id="group_id"
        class="ml-2"
      />
    </template>
    <v-divider />

    <v-card-text>
      <div
        class="user_calendar_wrapper"
        v-for="(item, index) in items"
        :key="`user_${index}`"
      >
        <v-row>
          <v-col>
            <User :user="item.user" />
          </v-col>
          <v-col>
            <Total :entries="item.entries" :allocations="item.allocations" />
          </v-col>
        </v-row>
        <Calendar :entries="item.entries" />
      </div>

      <div ref="sentinel" style="height: 1px" />
      <v-progress-circular
        v-if="loading"
        indeterminate
        class="d-block mx-auto my-4"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from "axios"
import Calendar from "@/components/Calendar.vue"
import User from "@/components/User.vue"
import Total from "@/components/Total.vue"
import ExcelExportButton from "@/components/ExcelExportButton.vue"
import type { Group, GroupItem } from "@/types"

const route = useRoute()
const router = useRouter()

const group_id = computed(() => String(route.params.id))
const year = ref(Number(route.query.year) || new Date().getFullYear())
const yearItems = Array.from(Array(10).keys()).map(
  (x) => new Date().getFullYear() + x - 5
)

const items = ref<GroupItem[]>([])
const total = ref(0)
const group = ref<Group | null>(null)
const loading = ref(false)
const all_loaded = ref(false)
const sentinel = ref<HTMLDivElement | null>(null)
let observer: IntersectionObserver | null = null

function get_group() {
  const url = `${import.meta.env.VITE_GROUP_MANAGER_API_URL}/groups/${group_id.value}`
  axios
    .get<Group>(url)
    .then(({ data }) => {
      group.value = data
    })
    .catch((error) => {
      if (error.response) console.error(error.response.data)
      else console.error(error)
    })
}

function get_entries() {
  if (loading.value || all_loaded.value) return
  loading.value = true
  const url = `/groups/${group_id.value}/entries`
  const params = { year: year.value, limit: 10, skip: items.value.length }

  axios
    .get<{ items: GroupItem[]; total: number }>(url, { params })
    .then(({ data }) => {
      items.value = items.value.concat(data.items)
      total.value = data.total
      if (items.value.length >= total.value) {
        all_loaded.value = true
      }
    })
    .catch((error) => {
      console.error(error)
      all_loaded.value = true
    })
    .finally(() => {
      loading.value = false
    })
}

function reset() {
  items.value = []
  total.value = 0
  all_loaded.value = false
  get_entries()
}

function setup_observer() {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !loading.value && !all_loaded.value) {
        get_entries()
      }
    },
    { threshold: 0.1 }
  )
  if (sentinel.value) observer.observe(sentinel.value)
}

watch(
  () => route.params.id,
  () => reset()
)

watch(year, (newVal) => {
  router.replace({ query: { ...route.query, year: newVal } })
  reset()
})

onMounted(() => {
  get_group()
  setup_observer()
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.user_calendar_wrapper {
  margin: 1em 0;
  padding: 1em 0;
}

.user_calendar_wrapper:not(:last-child) {
  border-bottom: 1px solid #dddddd;
}
</style>

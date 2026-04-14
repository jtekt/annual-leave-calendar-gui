<template>
  <v-toolbar class="mb-6" elevation="3">
    <v-toolbar-title>
      {{ group ? group.name : group_id }}
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-select
      :items="yearItems"
      v-model="year"
      :label="t('Year')"
      hide-details
      variant="outlined"
      density="compact"
      class="mr-2"
      max-width="150px"
    />
    <ExcelExportButton :total="total" :year="year" :group_id="group_id" />
  </v-toolbar>

  <v-row v-for="(item, index) in items" :key="`user_${index}`">
    <v-col>
      <!-- <v-card>
        <v-card-text>
          <v-row>
            <v-col>
              <User :user="item.user" />
            </v-col>
            <v-col>
              <Total :entries="item.entries" :allocations="item.allocations" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <Calendar :entries="item.entries" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card> -->
      <UserCard
        :user="item.user"
        :entries="item.entries"
        :allocations="item.allocations"
      />
    </v-col>
  </v-row>

  <div ref="sentinel" style="height: 1px" />
  <v-progress-circular
    v-if="loading"
    indeterminate
    class="d-block mx-auto my-4"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import axios from "axios"
import Calendar from "@/components/Calendar.vue"
import User from "@/components/User.vue"
import Total from "@/components/Total.vue"
import ExcelExportButton from "@/components/ExcelExportButton.vue"
import type { Group, GroupItem } from "@/types"
import UserCard from "@/components/UserCard.vue"

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const group_id = computed(() => String(route.params.id))
const yearItems = Array.from(
  { length: 10 },
  (_, i) => new Date().getFullYear() + i - 5
)
const year = computed({
  get: () => Number(route.query.year) || new Date().getFullYear(),
  set: (val) => router.replace({ query: { ...route.query, year: val } }),
})

const items = ref<GroupItem[]>([])
const total = ref(0)
const group = ref<Group | null>(null)
const loading = ref(false)
const all_loaded = ref(false)
const sentinel = ref<HTMLDivElement | null>(null)
let observer: IntersectionObserver | null = null

function get_group() {
  const url = `${import.meta.env.VITE_GROUP_MANAGER_API_URL}/v3/groups/${group_id.value}`
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

watch(year, () => reset())

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

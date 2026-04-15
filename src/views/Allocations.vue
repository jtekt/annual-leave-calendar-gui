<template>
  <v-container class="py-8" max-width="900">
    <v-card class="mx-auto">
      <v-card-title class="d-flex align-center text-h5 font-weight-bold">
        <v-icon icon="mdi-calendar-check" class="mr-3" size="28" />
        {{ t("Register allocations") }}
      </v-card-title>

      <v-divider />

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <div style="max-width: 260px; margin-left: 65%; margin-top: 4%">
              <v-select
                :items="yearItems"
                v-model="year"
                :label="t('Year')"
                variant="outlined"
                density="comfortable"
              />
            </div>
          </v-col>
        </v-row>
        <CreateAllocation
          :user_id="user_id"
          :year="year"
          :exist="allocations"
          @createAllocation="get_allocations"
        />
      </v-card-text>
    </v-card>
  </v-container>
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

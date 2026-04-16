<template>
  <v-row>
    <v-col>
      <v-card prepend-icon="mdi-account-search">
        <template #title>
          {{ t("User search") }}
        </template>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field
                v-model="query"
                :label="t('Search')"
                append-inner-icon="mdi-magnify"
                @update:model-value="query_users"
              />
            </v-col>
          </v-row>
          <v-data-table-server
            :loading="employees_loading"
            :headers="headers"
            :items="employees"
            :items-length="total"
            :items-per-page="options.itemsPerPage"
            :page="options.page"
            @update:options="update_options"
            @click:row="(event, { item }) => handleRowClick(item)"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import axios from "axios"

const { t } = useI18n()
const router = useRouter()

const query = ref("")
const total = ref(0)
const employees = ref([])
const employees_loading = ref(false)

const options = ref({
  page: 1,
  itemsPerPage: 50,
})

const headers = computed(() => [
  { title: t("Name"), key: "display_name" },
  { title: t("Employee number"), key: "employee_number" },
  { title: t("Role"), key: "role" },
  { title: t("E-mail"), key: "email_address" },
])

async function query_users() {
  try {
    employees_loading.value = true

    const params = {
      batch_size: options.value.itemsPerPage,
      start_index: (options.value.page - 1) * options.value.itemsPerPage,
      search: query.value,
    }

    const { data } = await axios.get(
      `${import.meta.env.VITE_USER_MANAGER_API_URL}/v3/employees`,
      { params }
    )

    total.value = data.count
    employees.value = data.users
  } catch (error) {
    console.error(error)
  } finally {
    employees_loading.value = false
  }
}

function update_options(newOptions: any) {
  options.value = newOptions
  query_users()
}

function handleRowClick(user: any) {
  if (!user?._id) return

  router.push({
    name: "user_entries",
    params: { id: user._id },
  })
}
</script>

<template>
  <v-card
    max-width="30rem"
    class="mx-auto"
    :loading="entry_loading"
    prepend-icon="mdi-calendar"
  >
    <template #title>{{ entry ? format_date(entry.date) : "" }}</template>
    <template v-if="editable" #append>
      <v-btn
        color="#c00000"
        @click="delete_entry"
        prepend-icon="mdi-delete"
        :loading="entry_loading"
        :disabled="entry_loading"
      >
        {{ t("Schedule delete") }}
      </v-btn>
    </template>
    <v-divider />

    <template v-if="entry">
      <v-card-text>
        <v-row align="baseline">
          <v-col>
            <v-progress-circular v-if="user_loading" indeterminate />
            <UserChip v-else-if="user" :user="user" />
            <router-link
              v-else
              :to="{ name: 'user_entries', params: { id: entry.user_id } }"
            >
              {{ entry.user_id }}
            </router-link>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select
              :disabled="!editable || entry_loading"
              :items="types"
              v-model="entry.type"
              :label="t('Type')"
              @update:model-value="update_entry"
              hide-details
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-checkbox
              :label="t('Refresh')"
              :disabled="!editable || entry_loading"
              v-model="entry.refresh"
              @update:model-value="update_entry"
              hide-details
            />
          </v-col>
          <v-col>
            <v-checkbox
              :label="t('Reserve')"
              :disabled="!editable || entry_loading"
              v-model="entry.reserve"
              @update:model-value="update_entry"
              hide-details
            />
          </v-col>
        </v-row>
      </v-card-text>
    </template>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import axios from "axios"
import { useIdUtils } from "@/composables/useIdUtils"
import UserChip from "@/components/UserChip.vue"
import type { Entry, User as UserType } from "@/types"

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { current_user_id } = useIdUtils()

const entry = ref<Entry | null>(null)
const entry_loading = ref(false)
const user = ref<UserType | null>(null)
const user_loading = ref(false)
const snackbar = ref({ show: false, message: "", color: "red" })

const editable = computed(() => {
  if (!entry.value) return false
  return entry.value.user_id.toString() === current_user_id.value
})

const types = computed(() => [
  { title: t("All day"), value: "有休" },
  { title: t("Morning"), value: "前半休" },
  { title: t("Afternoon"), value: "後半休" },
])

function format_date(date: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  }
  return new Date(date).toLocaleString("ja-JP", options)
}

async function get_user(user_id: string) {
  try {
    user_loading.value = true
    const url = `${import.meta.env.VITE_USER_MANAGER_API_URL}/v3/employees/${user_id}`
    const { data } = await axios.get<UserType>(url)
    user.value = data
  } catch (error) {
    console.error(error)
  } finally {
    user_loading.value = false
  }
}
async function get_entry() {
  try {
    entry_loading.value = true
    const entry_id = route.params.id
    const { data } = await axios.get<Entry>(`/entries/${entry_id}`)
    entry.value = data
    await get_user(data.user_id)
  } catch (error) {
    snackbar.value = {
      show: true,
      message: t("Error while getting entry"),
      color: "red",
    }
    console.error(error)
  } finally {
    entry_loading.value = false
  }
}

async function update_entry() {
  if (!entry.value) return
  try {
    entry_loading.value = true
    await axios.put(`/entries/${entry.value._id}`, entry.value)
    snackbar.value = { show: true, message: t("Entry saved"), color: "green" }
  } catch (error) {
    console.error(error)
    snackbar.value = {
      show: true,
      message: t("Error while updating entry"),
      color: "red",
    }
  } finally {
    entry_loading.value = false
  }
}

async function delete_entry() {
  if (!entry.value) return
  if (!confirm(t("Delete entry confirmation"))) return
  try {
    entry_loading.value = true
    await axios.delete(`/entries/${entry.value._id}`)
    router.push({
      name: "user_entries",
      params: { id: entry.value.user_id },
    })
  } catch (error) {
    snackbar.value = {
      show: true,
      message: t("Error while deleting entry"),
      color: "red",
    }
    console.error(error)
  } finally {
    entry_loading.value = false
  }
}

onMounted(() => get_entry())
</script>

<style scoped>
.entry {
  text-align: center;
}
</style>

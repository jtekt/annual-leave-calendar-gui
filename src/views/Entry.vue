<template>
  <v-card max-width="30rem" class="mx-auto" :loading="entry_loading">
    <template v-if="entry">
      <v-container fluid>
        <v-row align="baseline">
          <v-col>
            <v-toolbar-title>{{ format_date(entry.date) }}</v-toolbar-title>
          </v-col>
          <v-spacer />
          <v-col cols="auto" v-if="editable">
            <v-btn color="#c00000" @click="delete_entry" prepend-icon="mdi-delete">
              {{ t("Schedule delete") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-divider />

      <v-card-text>
        <v-row align="baseline">
          <v-col cols="auto">{{ t("User") }}:</v-col>
          <v-col>
            <v-progress-circular v-if="user_loading" indeterminate />
            <User v-else-if="user" :user="user" />
            <router-link
              v-else
              :to="{ name: 'user_entries', params: { id: entry.user_id } }"
            >
              {{ entry.user_id }}
            </router-link>
          </v-col>
        </v-row>

        <v-select
          :disabled="!editable"
          :items="types"
          v-model="entry.type"
          :label="t('Type')"
          @update:model-value="update_entry"
        />

        <v-row>
          <v-col>
            <v-checkbox
              :label="t('Refresh')"
              :disabled="!editable"
              v-model="entry.refresh"
              @update:model-value="update_entry"
            />
          </v-col>
          <v-col>
            <v-checkbox
              :label="t('Reserve')"
              :disabled="!editable"
              v-model="entry.reserve"
              @update:model-value="update_entry"
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
import User from "@/components/User.vue"
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

function get_user(user_id: string) {
  user_loading.value = true
  const url = `${import.meta.env.VITE_USER_MANAGER_API_URL}/v3/employees/${user_id}`
  axios
    .get<UserType>(url)
    .then(({ data }) => {
      user.value = data
    })
    .catch((error) => console.error(error))
    .finally(() => (user_loading.value = false))
}

function get_entry() {
  entry_loading.value = true
  const entry_id = route.params.id
  axios
    .get<Entry>(`/entries/${entry_id}`)
    .then(({ data }) => {
      entry.value = data
      get_user(data.user_id)
    })
    .catch((error) => {
      alert("Error while getting the entry")
      console.error(error)
    })
    .finally(() => (entry_loading.value = false))
}

function update_entry() {
  if (!entry.value) return
  entry_loading.value = true
  axios
    .put(`/entries/${entry.value._id}`, entry.value)
    .then(() => {
      snackbar.value = { show: true, message: "Entry saved", color: "green" }
    })
    .catch((error) => {
      console.error(error)
      alert("Error while updating the entry")
    })
    .finally(() => (entry_loading.value = false))
}

function delete_entry() {
  if (!entry.value) return
  if (!confirm("ホンマに？")) return
  axios
    .delete(`/entries/${entry.value._id}`)
    .then(() => {
      router.push({
        name: "user_entries",
        params: { id: entry.value!.user_id },
      })
    })
    .catch((error) => {
      alert("Error while deleting the entry")
      console.error(error)
    })
}

onMounted(() => get_entry())
</script>

<style scoped>
.entry {
  text-align: center;
}
</style>

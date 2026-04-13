<template>
  <v-card max-width="30rem" class="mx-auto" prepend-icon="mdi-calendar-plus">
    <template #title>{{ t("Create entry") }}</template>
    <v-divider />

    <v-card-text>
      <v-form @submit.prevent="submit">
        <v-row justify="center">
          <v-col cols="auto">
            <v-date-picker color="black" elevation="1" v-model="date" :events="entryDates" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select
              :items="types"
              v-model="type"
              :label="t('Type')"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              :disabled="!date"
              type="submit"
              prepend-icon="mdi-plus"
              block
              color="primary"
            >
              {{ t("Create entry") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import axios from "axios"
import type { Entry } from "@/types"

const { t } = useI18n()
const router = useRouter()

const date = ref<string | null>(null)
const type = ref("有休")
const entries = ref<Entry[]>([])

const entryDates = computed(() => entries.value.map((e) => e.date.substring(0, 10)))

const types = computed(() => [
  { title: t("All day"), value: "有休" },
  { title: t("Morning"), value: "前半休" },
  { title: t("Afternoon"), value: "後半休" },
])

function get_entries() {
  const params = { year: new Date().getFullYear() }
  axios
    .get<Entry[]>("/users/self/entries", { params })
    .then(({ data }) => {
      entries.value = data
    })
    .catch((error) => console.error(error))
}

function submit() {
  const body = {
    date: Array.isArray(date.value) ? date.value[0] : date.value,
    type: type.value,
  }
  axios
    .post<{ _id: string }>("/users/self/entries", body)
    .then(({ data }) => {
      router.push({ name: "entry", params: { id: data._id } })
    })
    .catch((error) => {
      alert(error.response?.data ?? t("Error while creating entry"))
      console.error(error)
    })
}

onMounted(() => get_entries())
</script>


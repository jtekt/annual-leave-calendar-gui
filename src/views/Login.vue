<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card :loading="loading" elevation="4">
          <!-- Header -->
          <v-card-item class="text-center py-6" style="background-color: #000">
            <v-icon size="48" color="white" class="mb-2">mdi-calendar-check</v-icon>
            <v-card-title class="text-white text-h5">{{ t("App title") }}</v-card-title>
          </v-card-item>

          <v-card-text class="pa-6">
            <v-form @submit.prevent="submit" ref="form">
              <v-text-field
                v-model="username"
                :label="t('Username')"
                prepend-inner-icon="mdi-account-outline"
                autocomplete="username"
                variant="outlined"
                :disabled="loading"
                class="mb-2"
              />

              <v-text-field
                v-model="password"
                :label="t('Password')"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="show_password ? 'mdi-eye-off' : 'mdi-eye'"
                :type="show_password ? 'text' : 'password'"
                autocomplete="current-password"
                variant="outlined"
                :disabled="loading"
                @click:append-inner="show_password = !show_password"
              />

              <p v-if="login_hint" class="text-caption text-medium-emphasis mb-4">
                {{ login_hint }}
              </p>

              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
                :disabled="!username || !password"
              >
                {{ t("Login") }}
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="error_shown" color="error" location="top">
      {{ error_message }}
      <template #actions>
        <v-btn variant="text" @click="error_shown = false">{{ t("Close") }}</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useI18n } from "vue-i18n"
import { useAuth } from "@/composables/useAuth"

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const { login } = useAuth()

const username = ref("")
const password = ref("")
const show_password = ref(false)
const loading = ref(false)
const error_shown = ref(false)
const error_message = ref("")

const login_hint = import.meta.env.VITE_LOGIN_HINT

async function submit() {
  if (!username.value || !password.value) return
  loading.value = true
  error_shown.value = false

  try {
    await login(username.value, password.value)

    // Redirect to the originally requested page, or home
    const redirect = route.query.redirect
    router.push(typeof redirect === "string" ? redirect : { name: "new_entry" })
  } catch (err: unknown) {
    const error = err as { response?: { data?: string | { message?: string } } }
    const data = error.response?.data
    if (typeof data === "string") {
      error_message.value = data
    } else if (data?.message) {
      error_message.value = data.message
    } else {
      error_message.value = t("Login failed. Please check your credentials.")
    }
    error_shown.value = true
    password.value = ""
  } finally {
    loading.value = false
  }
}
</script>

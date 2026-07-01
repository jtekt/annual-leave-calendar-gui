<template>
  <v-card max-width="50rem" class="mx-auto" prepend-icon="mdi-account-group">
    <template #title>{{ t("Groups") }}</template>

    <v-card-text>
      <GroupPicker
        class="group_picker"
        :groupManagerApiUrl="groupManagerApiUrl"
        :accessToken="session?.accessToken"
        @selection="select_group($event)"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { useIdUtils } from "@/composables/useIdUtils"
import { GroupPicker } from "@moreillon/group-manager-vue-picker"
import { useAuth } from "@jtekt/vuetify-auth"

const { session } = useAuth()
const { t } = useI18n()

const router = useRouter()
const { get_id_of_item } = useIdUtils()
const groupManagerApiUrl = import.meta.env.VITE_GROUP_MANAGER_API_URL

function select_group(group: Record<string, unknown>) {
  const group_id = get_id_of_item(group)
  router.push({ name: "group_entries", params: { id: group_id } })
}
</script>

<style scoped>
.group_picker {
  text-align: left;
  max-height: 70vh;
}
</style>

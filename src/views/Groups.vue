<template>
  <v-card max-width="50rem" class="mx-auto" prepend-icon="mdi-account-group">
    <template #title>{{ t("Groups") }}</template>

    <v-card-text>
      <GroupPicker
        v-if="groupManagerApiUrl"
        class="group_picker"
        :groupManagerApiUrl="groupManagerApiUrl"
        :accessToken="session?.accessToken"
        @selection="select_group($event)"
      />
      <template v-else>
        <v-progress-linear v-if="groups_loading" indeterminate />
        <v-list>
          <v-list-item
            v-for="group in groups"
            :key="group._id"
            :title="group._id"
            :subtitle="`${group.member_count} ${t('members')}`"
            prepend-icon="mdi-account-multiple"
            @click="router.push({ name: 'group_entries', params: { id: group._id } })"
          />
        </v-list>
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import axios from "axios"
import { useIdUtils } from "@/composables/useIdUtils"
import { GroupPicker } from "@jtekt/group-manager-vue-picker"
import { useAuth } from "@jtekt/vuetify-auth"
import runtimeEnv from "@/runtimeEnv"

const { session } = useAuth()
const { t } = useI18n()
const router = useRouter()
const { get_id_of_item } = useIdUtils()
const groupManagerApiUrl = runtimeEnv.VITE_GROUP_MANAGER_API_URL

const groups = ref<{ _id: string; member_count: number }[]>([])
const groups_loading = ref(false)

function select_group(group: Record<string, unknown>) {
  const group_id = get_id_of_item(group)
  router.push({ name: "group_entries", params: { id: group_id } })
}

async function fetch_groups() {
  groups_loading.value = true
  try {
    const { data } = await axios.get<{ _id: string; member_count: number }[]>(
      "/v1/groups"
    )
    groups.value = data
  } catch (error) {
    console.error(error)
  } finally {
    groups_loading.value = false
  }
}

onMounted(() => {
  if (!groupManagerApiUrl) fetch_groups()
})
</script>

<style scoped>
.group_picker {
  text-align: left;
  max-height: 70vh;
}
</style>

<template>
  <v-card max-width="50rem" class="mx-auto" prepend-icon="mdi-account-group">
    <template #title>{{ t("Groups") }}</template>

    <v-card-text>
      <GroupPicker
        v-if="VITE_GROUP_MANAGER_API_URL"
        class="group_picker"
        :groupManagerApiUrl="VITE_GROUP_MANAGER_API_URL"
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
            :href="`/groups/${encodeURIComponent(group._id)}/entries`"
          >
            <template #append>
              <v-chip
                v-if="group.is_member"
                color="primary"
                size="x-small"
                variant="tonal"
                prepend-icon="mdi-account-check"
                class="mr-1"
              >
                {{ t("member") }}
              </v-chip>
            </template>
          </v-list-item>
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
const { VITE_GROUP_MANAGER_API_URL, VITE_STANDALONE_MODE } = runtimeEnv

type GroupApiItem = { _id: string; member_count: number; is_member: number }

const groups = ref<GroupApiItem[]>([])
const groups_loading = ref(false)

function select_group(group: Record<string, unknown>) {
  const group_id = get_id_of_item(group)
  router.push({ name: "group_entries", params: { id: group_id } })
}

async function fetch_groups() {
  groups_loading.value = true
  try {
    const { data } = await axios.get<GroupApiItem[]>("/v1/groups")
    groups.value = data
  } catch (error) {
    console.error(error)
  } finally {
    groups_loading.value = false
  }
}

onMounted(() => {
  if (!VITE_GROUP_MANAGER_API_URL && VITE_STANDALONE_MODE) fetch_groups()
})
</script>

<style scoped>
.group_picker {
  text-align: left;
  max-height: 70vh;
}
</style>

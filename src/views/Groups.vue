<template>
  <v-card max-width="30rem" class="mx-auto">
    <v-card-title>Groups</v-card-title>

    <v-card-text>
      <GroupPicker class="group_picker" @selection="select_group($event)" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { useIdUtils } from "@/composables/useIdUtils"
import { GroupPicker } from "@moreillon/group-manager-vue-picker"

const router = useRouter()
const { get_id_of_item } = useIdUtils()

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

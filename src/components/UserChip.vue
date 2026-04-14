<template>
  <v-chip :to="{ name: 'user_entries', params: { id: get_id_of_item(user) } }">
    <v-avatar start>
      <v-img
        class="avatar"
        v-if="user.avatar_src"
        :src="user.avatar_src"
        height="2em"
        width="2em"
      />
      <v-icon v-else>mdi-account</v-icon>
    </v-avatar>
    <span class="name">{{ user.display_name || user.name_kanji }}</span>
  </v-chip>
</template>

<script setup lang="ts">
import { useIdUtils } from "@/composables/useIdUtils"
import type { User } from "@/types"

defineProps<{
  user: User
}>()

const { get_id_of_item } = useIdUtils()
</script>

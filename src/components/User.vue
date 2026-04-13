<template>
  <router-link
    class="user"
    :to="{ name: 'user_entries', params: { id: get_id_of_item(user) } }"
  >
    <img class="avatar" v-if="user.avatar_src" :src="user.avatar_src" />
    <v-icon v-else>mdi-account</v-icon>
    <span class="name">{{ user.display_name || user.name_kanji }}</span>
  </router-link>
</template>

<script setup lang="ts">
import { useIdUtils } from "@/composables/useIdUtils"
import type { User } from "@/types"

defineProps<{
  user: User
}>()

const { get_id_of_item } = useIdUtils()
</script>

<style scoped>
.user {
  color: currentcolor;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  padding: 0.25em 1em;
  border: 1px solid #dddddd;
  border-radius: 0.25em;
  transition: 0.25s;
  font-size: 110%;
}

.name {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.avatar {
  width: 1em;
  height: 1em;
  margin-right: 0.25em;
}

.user:hover {
  border-color: #c00000;
  color: #c00000;
}
</style>

<template>

  <router-link
    class="user"
    :to="{ name: 'user_entries', params: {id: get_id_of_item(user)} }">

    <img
      class="avatar"
      v-if="user.avatar_src"
      :src="user.avatar_src">
    
    <v-icon v-else>mdi-account</v-icon>

    <!-- <account-icon
      class="avatar"
      v-else /> -->

    <span class="name">
      {{user.display_name ||
        user.name_kanji}}
    </span>

  </router-link>

</template>

<script>
// @ is an alias to /src
import IdUtils from '@/mixins/IdUtils.js'

export default {
  name: 'User',
  mixins: [IdUtils],
  props: {
    user: Object,
  }
}
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
}

.name {
  max-width: 150px;
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

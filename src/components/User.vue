<template>

  <router-link
    class="user"
    :to="{ name: 'user_entries', params: {id: user.identity.low} }">
    {{user.properties.display_name}}
  </router-link>

</template>

<script>
// @ is an alias to /src

export default {
  name: 'User',
  components: {

  },
  props: {
    user: Object,
  }


}
</script>

<style scoped>
.user {
  color: currentcolor;
}
</style>

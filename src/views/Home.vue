<template>
  <div class="home">
    <h1>年休カレンダー</h1>
    <p>
      自分の予定をみるために、<router-link :to="{ name: 'user_entries', params: {id: 'self'} }">こちら</router-link>.
    </p>
    <p>
      新しい予定を追加するために、<router-link :to="{ name: 'new_entry'}">こちら</router-link>.
    </p>
    <p>
      部署、室または、グループのメンバーの予定を見れために、<router-link :to="{ name: 'groups'}">こちら</router-link>.
    </p>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
}
</script>

<style scoped>

</style>

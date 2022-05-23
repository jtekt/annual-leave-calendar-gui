<template>
  <v-card>

    <p>
      <select class="" v-model="language">
        <option value="jp">日本語</option>
        <option value="en">English</option>
      </select>
    </p>

    <template v-if="language === 'jp'">
      <h1>年休カレンダー</h1>
      <p>
        自分の予定を見るために、<router-link :to="{ name: 'user_entries', params: {id: 'self'} }">こちら</router-link>.
      </p>
      <p>
        予定を追加するために、<router-link :to="{ name: 'new_entry'}">こちら</router-link>.
      </p>
      <p>
        部署、室または、グループのメンバーの予定を見れために、<router-link :to="{ name: 'groups'}">こちら</router-link>.
      </p>
    </template>

    <template v-if="language === 'en'">
      <h1>Annual leaves calendar</h1>
      <p>
        To see your plans for days off, click <router-link :to="{ name: 'user_entries', params: {id: 'self'} }">here</router-link>.
      </p>
      <p>
        To create a plan for a day off, click <router-link :to="{ name: 'new_entry'}">here</router-link>.
      </p>
      <p>
        To see the days off of a group, section or department, click <router-link :to="{ name: 'groups'}">here</router-link>.
      </p>
      <p>
        Please excuse the lack of English support for this application.
      </p>
    </template>




  </v-card>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  data(){
    return {
      language: 'jp'
    }
  }
}
</script>

<style scoped>

</style>

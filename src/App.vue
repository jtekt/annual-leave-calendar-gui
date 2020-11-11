<template>
  <div id="app">
    <AppTemplate
      :authenticate="true"
      applicationName="行先掲示板">

      <template v-slot:navigation>
        <router-link :to="{ name: 'home'}">ホーム</router-link>
        <router-link :to="{ name: 'new_entry'}">新しい予定</router-link>
        <router-link :to="{ name: 'user_entries', params: {id: 'self'}}">私の予定</router-link>
        <router-link :to="{ name: 'groups'}">グループ</router-link>
        <router-link :to="{ name: 'about'}">About</router-link>
      </template>


    </AppTemplate>

  </div>
</template>

<script>
import AppTemplate from '@moreillon/vue_application_template_flex'


export default {
  name: 'app',
  components: {
    AppTemplate,
  },
  data(){
    return {
    }
  },

}
</script>


<style>

main {
  text-align: center;
}


</style>

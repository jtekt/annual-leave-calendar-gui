<template>
  <div id="app">
    <AppTemplate
      :authenticate="true"
      applicationName="年休カレンダー">

      <template v-slot:navigation>
        <router-link :to="{ name: 'home'}">
          <home-icon/><span>ホーム</span>
        </router-link>
        <router-link :to="{ name: 'new_entry'}">
          <plus-icon/>
          <span>予定追加</span>
        </router-link>
        <router-link :to="{ name: 'user_entries', params: {id: 'self'}}">
          <account-icon/>
          <span>自分の予定f</span>

        </router-link>
        <router-link :to="{ name: 'groups'}">
          <account-multiple-icon />
          <span>グループ</span>

        </router-link>
        <router-link :to="{ name: 'about'}">
          <information-outline-icon />
          <span>About</span>
        </router-link>
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
  mounted(){
    this.get_current_user()
  },
  methods: {
    get_current_user(){
      const url = `${process.env.VUE_APP_AUTHENTICATION_API_URL}/whoami`
      this.axios.get(url)
      .then(response => { this.$store.commit('set_current_user',response.data) })
      .catch(error => { console.error(error) })
    }
  }

}
</script>


<style>

.material-design-icon__svg {
  bottom: 0 !important;
}

main {
  text-align: center;
}

.button, button {
  text-decoration: none;
  color: currentcolor;

  font-size: 90%;
  border: 1px solid #444444;
  border-radius: 0.25em;
  padding: 0.25em 0.5em;

  display: inline-flex;
  align-items: center;
  background-color: transparent;
  transition: 0.25s;
}

.button > *:not(:last-child),
button > *:not(:last-child)
 {
  margin-right: 0.25em;
}

.button:hover, button:hover {
  color: #c00000;
  border-color: #c00000;
}


</style>

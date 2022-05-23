<template>
  <AppTemplate
    :options="options"
    @user="get_user($event)">

    <template v-slot:nav>
      <v-list
        dense
        nav >
        <v-list-item
          v-for="(item, index) in nav"
          :key="`nav_item_${index}`"
          :to="item.to"
          exact>
          <v-list-item-icon>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>

  </AppTemplate>
</template>

<script>
import AppTemplate from '@moreillon/vue_application_template_vuetify'
export default {
  name: 'App',

  components: {
    AppTemplate
  },

  data: () => ({
    options: {
      title: "年休カレンダー",
      authenticate: true,
      login_url: `${process.env.VUE_APP_AUTHENTICATION_API_URL}/login`,
      identification_url: `${process.env.VUE_APP_AUTHENTICATION_API_URL}/v2/whoami`,
    },
    nav: [
      {title: '予定追加', to: {name: 'new_entry'}, icon: 'mdi-plus'},
      {title: '自分の予定', to: {name: 'user_entries', params: {id: 'self'}}, icon: 'mdi-account'},
      {title: '自分の予定', to: {name: 'groups'}, icon: 'mdi-account-multiple'},
      {title: 'アプリについて', to: {name: 'about'}, icon: 'mdi-information-outline'},
    ]
  }),

  methods: {
    get_user(user){
      console.log(user)
    }
  }
};
</script>
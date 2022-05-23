<template>
  <v-card
    max-width="30rem"
    class="mx-auto">
    <v-card-title>
      年休カレンダー
    </v-card-title>
    <v-card-text>
      <p>Developped by Maxime MOREILLON</p>
      <p>Version {{version}}</p>
      <p>API URL: {{api_url}}</p>
      <p>User manager API URL: {{user_manager_api_url}}</p>
      <p>Authentication API URL: {{authentication_api_url}}</p>
      <p>Group manager API URL: {{group_manager_api_url}}</p>
    </v-card-text>
    
  </v-card>
</template>

<script>
import pjson from '../../package.json'


export default {
  name: 'app',

  data(){
    return {
      version: pjson.version,
      api_url: process.env.VUE_APP_API_URL,
      group_manager_api_url: process.env.VUE_APP_GROUP_MANAGER_API_URL,
      authentication_api_url: process.env.VUE_APP_AUTHENTICATION_API_URL,
      user_manager_api_url: process.env.VUE_APP_USER_MANAGER_API_URL,
    }
  },

}
</script>

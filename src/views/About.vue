<template>
  <div class="about">
    <h1>About</h1>
    <p>年休カレンダー</p>
    <p>Developped in 4 hours by Maxime MOREILLON</p>
    <p>Version {{version}}</p>
    <p>User manager API url: {{user_manager_api_url}}</p>
    <p>Authentication API url: {{authentication_api_url}}</p>
    <p>Group manager API url: {{group_manager_api_url}}</p>
  </div>
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

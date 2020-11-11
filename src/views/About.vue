<template>
  <div class="about">
    <h1>About</h1>
    <p>年休カレンダー</p>
    <p>Developped in 4 hours by Maxime MOREILLON</p>
    <p>Version {{version}}</p>
  </div>
</template>

<script>
import pjson from '../../package.json'


export default {
  name: 'app',

  data(){
    return {
      version: pjson.version
    }
  },

}
</script>

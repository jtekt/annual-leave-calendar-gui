<template>
  <v-card
    max-width="30rem"
    class="mx-auto">

    <v-card-title>
      Groups
    </v-card-title>

    <v-card-text>
      <GroupPicker
        class="group_picker"
        @selection="select_group($event)"/>
    </v-card-text>

    




  </v-card>
</template>

<script>
// @ is an alias to /src
import GroupPicker from '@moreillon/vue_group_picker'
import IdUtils from '@/mixins/IdUtils.js'


export default {
  name: 'Entry',
  components: {
    GroupPicker,
  },
  mixins: [IdUtils],
  data() {
    return {

    }
  },
  methods: {
    select_group(group){
      const group_id = this.get_id_of_item(group)
      this.$router.push({name: 'group_entries', params: {id: group_id}})
    }

  },

}
</script>

<style scoped>
.group_picker {
  text-align: left;
  max-height: 70vh;
}
</style>

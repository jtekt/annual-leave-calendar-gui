<template>
  <div class="about">
    <h1>Groups</h1>

    <GroupPicker
      class="group_picker"
      @selection="select_group($event)"/>




  </div>
</template>

<script>
// @ is an alias to /src
import GroupPicker from '@moreillon/vue_group_picker'


export default {
  name: 'Entry',
  components: {
    GroupPicker,
  },
  data() {
    return {

    }
  },
  methods: {
    select_group(group){
      const group_id = group.identity.low
      this.$router.push({name: 'group_entries', params: {id: group_id}})
    }

  },

}
</script>

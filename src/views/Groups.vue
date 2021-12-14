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
  max-width: 600px;
  max-height: 600px;
  margin-left: auto;
  margin-right: auto;
}
</style>

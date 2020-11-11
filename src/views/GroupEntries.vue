<template>
  <div class="group_entries">
    <h1>Group entries</h1>

    <div
      class="user_calendar_wrapper"
      v-for="user in users"
      :key="user.identity.low" >


      <User :user="user" />

      <Calendar :entries="user.entries"/>

    </div>






  </div>
</template>

<script>
// @ is an alias to /src
import Calendar from '@/components/Calendar.vue'
import User from '@/components/User.vue'

export default {
  name: 'GroupEntries',
  components: {
    Calendar,
    User
  },
  data() {
    return {
      users: []
    }
  },
  mounted(){
    this.get_entries()
  },
  methods: {
    get_entries(){
      const url = `${process.env.VUE_APP_API_URL}/groups/${this.group_id}/entries`
      this.axios.get(url)
      .then(response => {
        this.users = []
        response.data.forEach((record) => {
          const user = record._fields[record._fieldLookup.user]
          this.users.push(user)
        })

      })
      .catch(error => {
        console.error(error)
      })
    }
  },
  computed: {
    group_id(){
      return this.$route.params.id
    }
  }
}
</script>

<style scoped>
.user_calendar_wrapper {
  display: flex;
  align-items: center;
}

.user_calendar_wrapper:not(:last-child) {
  margin-bottom: 0.25em;
  padding-bottom: 0.25em;
  border-bottom: 1px solid #dddddd;
}

.user_calendar_wrapper > .user {
  flex-basis: 150px;
  flex-grow: 0;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  padding: 0.25em;


}
.user_calendar_wrapper > .calendar{
  flex-grow: 1;
}
</style>

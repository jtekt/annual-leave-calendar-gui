<template>
  <div class="group_entries">
    <h1 v-if="group">{{group.properties.name}}</h1>
    <h1 v-else>Group entries</h1>

    <template v-if="!loading">
      <div
        class="user_calendar_wrapper"
        v-for="user in users"
        :key="user.identity.low" >

        <div class="user_wrapper">
          <User :user="user" />
          <Total :entries="user.entries" />
        </div>



        <Calendar :entries="user.entries"/>

      </div>
    </template>

    <p v-if="loading">
      Loading...
    </p>






  </div>
</template>

<script>
// @ is an alias to /src
import Calendar from '@/components/Calendar.vue'
import User from '@/components/User.vue'
import Total from '@/components/Total.vue'

export default {
  name: 'GroupEntries',
  components: {
    Calendar,
    User,
    Total
  },
  data() {
    return {
      users: [],
      group: null,
      loading: false,
    }
  },
  mounted(){
    this.get_entries()
    this.get_group()
  },
  methods: {
    get_entries(){
      this.loading = true
      const url = `${process.env.VUE_APP_API_URL}/groups/${this.group_id}/entries`
      this.axios.get(url)
      .then(response => {
        this.users = []
        response.data.forEach((record) => {
          const user = record._fields[record._fieldLookup.user]
          this.users.push(user)
        })

      })
      .catch(error => { console.error(error) })
      .finally( () => {
        this.loading = false
      })
    },
    get_group(){
      const url = `${process.env.VUE_APP_GROUP_MANAGER_API_URL}/groups/${this.group_id}`
      this.axios.get(url)
      .then(response => {
        this.group = response.data
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
  align-items: stretch;
}

.user_calendar_wrapper:not(:last-child) {
  margin-bottom: 0.25em;
  padding-bottom: 0.25em;
  border-bottom: 1px solid #dddddd;
}

.user_calendar_wrapper > .user_wrapper {
  flex-basis: 150px;
  flex-grow: 0;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;

  padding: 0.25em;


}
.user_calendar_wrapper > .calendar{
  flex-grow: 1;
}
</style>

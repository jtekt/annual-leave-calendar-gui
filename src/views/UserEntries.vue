<template>
  <div class="user_entries">

    <h1 v-if="entries_loading">
      <Loader>Loading entries</loader>
    </h1>

    <template v-else>
      <h1 v-if="user_loading">
        <Loader>Loading user info</loader>
      </h1>

      <h1 v-else-if="user">{{user.properties.display_name}}さんの予定</h1>
      <h1 v-else>ユーザー{{user_id}}の予定</h1>


      <p v-if="this.$store.state.current_user.identity.low === user_id || user_id === 'self' ">
        <router-link
          class="button"
          :to="{ name: 'new_entry'}">
          <plus-icon />
          <span>予定追加</span>
        </router-link>
      </p>

      <p>
        <Total :entries="entries" />
      </p>

      <Calendar :entries="entries"/>
    </template>


  </div>
</template>

<script>
// @ is an alias to /src
import Calendar from '@/components/Calendar.vue'
import Total from '@/components/Total.vue'

export default {
  name: 'UserEntries',
  components: {
    Calendar,
    Total,
  },
  data() {
    return {
      entries: [],
      entries_loading: false,
      user: null,
      user_loading: false,
    }
  },
  mounted(){
    this.get_entries()
    this.get_user(this.user_id)
  },
  watch: {
    user_id(){
      this.get_entries()
      this.get_user(this.user_id)
    }
  },
  methods: {
    get_entries(){
      this.entries_loading = true
      const url = `${process.env.VUE_APP_API_URL}/users/${this.user_id}/entries`
      this.axios.get(url)
      .then(response => {
        this.entries = []
        response.data.forEach((entry) => { this.entries.push(entry) })
      })
      .catch(error => { console.error(error) })
      .finally(() => {this.entries_loading = false})
    },
    entries_of_month(month){
      return this.entries.filter(entry => {
        // NOTE: month start at 0
        return new Date(entry.date).getMonth() + 1 === month
      })
    },
    day_of_entry(entry){
      return new Date(entry.date).getDate()
    },
    get_user(user_id){
      this.user_loading = true
      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/employees/${user_id}`
      this.axios.get(url)
      .then(response => {
        const record = response.data[0]
        this.user = record._fields[record._fieldLookup.employee]
      })
      .catch(error => { console.error(error) })
      .finally(() => {this.user_loading = false})
    }
  },
  computed: {
    user_id(){
      return this.$route.params.id
    },
    total_yotei(){
      return this.entries.reduce( (total, entry) => {
        return  total + 0.5*entry.am + 0.5*entry.pm
      }, 0)
    },
    total_taken(){
      return this.entries.reduce( (total, entry) => {
        return  total + (0.5*entry.am + 0.5*entry.pm)*entry.taken
      }, 0)
    },
    current_month(){
      return new Date().getMonth() + 1
    }
  }
}
</script>
